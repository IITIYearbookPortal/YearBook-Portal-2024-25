const asyncHandler = require("express-async-handler");
const Memory = require("../models/memories");
const { randomUUID } = require("crypto");
const storage = require("../config/storage");
const PendingMemory = require("../models/pendingMemories.js");
const Users = require("../models/userModel");
const { validEmail } = require("../utils/otp");
const maxRecipients = 25;

const getMemories = asyncHandler(async (req, res) => {
  const { seniorId, seniorIds } = req.query;

  const filter = {
    isDeleted: false,
    toBeAcceptedBy: { $size: 0 },
  };

  if (seniorId) {
    filter.seniorId = seniorId;
  }

  if (seniorIds) {
    const recipients = seniorIds.split(",");
    if (recipients.length > maxRecipients || recipients.some((id) => !validEmail(id)))
      return res.status(400).json({ error: "Invalid senior IDs" });
    filter.seniorId = { $in: recipients };
  }

  const memories = await Memory.find(filter).sort({ createdAt: -1 });
  const response = memories.map((m) => ({
    id: m.id,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
    authorEmail: m.authorEmail,
    groupId: m.groupId,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
  }));
  res.json(response);
});

const createMemory = asyncHandler(async (req, res) => {
  const { locationId, content } = req.body;
  const authorName = req.user.name;
  const authorEmail = req.user.email;
  let { seniorIds } = req.body;

  //seniorsId is an array consisting targeting seniors emails as strings

  // console.log(req.body);

  if (typeof locationId !== "string" || !locationId || locationId.length > 80 ||
      typeof content !== "string" || !content.trim() || content.length > 500 ||
      !authorName || typeof seniorIds !== "string") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    seniorIds = JSON.parse(seniorIds);
  } catch {
    return res.status(400).json({ error: "Invalid seniorIds" });
  }
  if (!Array.isArray(seniorIds) || seniorIds.length === 0 ||
      seniorIds.length > maxRecipients || seniorIds.some((id) => !validEmail(id))) {
    return res.status(400).json({ error: "Invalid seniorIds" });
  }
  seniorIds = [...new Set(seniorIds)];
  const recipients = await Users.countDocuments({
    email: { $in: seniorIds },
    one_step_verified: true,
    two_step_verified: true,
  });
  if (recipients !== seniorIds.length)
    return res.status(400).json({ error: "Select verified alumni as recipients" });

  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    const uploads = await Promise.allSettled(req.files.map((file) =>
      storage.uploadImage(file.buffer, { folder: "yearbook/memories" }),
    ));
    const failure = uploads.find((result) => result.status === "rejected");
    const uploaded = uploads.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
    if (failure) {
      await Promise.allSettled(uploaded.map((file) => storage.deleteImage(file.public_id)));
      throw failure.reason;
    }
    imageUrls = uploaded.map((file) => file.url);
  }

  const groupId = randomUUID();

  const docs = seniorIds.map((seniorId) => ({
    locationId,
    seniorId,
    content,
    authorName,
    authorEmail,
    images: imageUrls,
    groupId,
    // isVerified : false,
    toBeAcceptedBy: seniorIds,
  }));

  const memories = await Memory.insertMany(docs);

  for (const memory of memories) {
    await PendingMemory.updateOne(
      { seniorEmail: memory.seniorId },
      { $addToSet: { memoryGroupIds: memory.groupId } },
      { upsert: true },
    );
  }
  const formatted = memories.map((m) => ({
    id: m.id,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
    authorEmail: m.authorEmail,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
    groupId: m.groupId,
    isVerified: false,
  }));

  res.status(201).json(formatted);
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const pending = await PendingMemory.findOne({
    seniorEmail: email,
  }).select("memoryGroupIds");

  if (!pending || !pending.memoryGroupIds?.length) {
    return res.json([]);
  }

  const memories = await Memory.find({
    seniorId: email,
    groupId: { $in: pending.memoryGroupIds },
  }).sort({ createdAt: -1 });

  const response = memories.map((m) => ({
    id: m._id,
    groupId: m.groupId,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
    authorEmail: m.authorEmail,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
  }));

  res.json(response);
});

const approveRequest = asyncHandler(async (req, res) => {
  const { memoryGroupId, email } = req.params;

  if (!memoryGroupId || !email) {
    res.status(400);
    throw new Error("Missing params");
  }

  const result = await Memory.updateMany(
    { groupId: memoryGroupId, toBeAcceptedBy: email },
    { $pull: { toBeAcceptedBy: email } },
  );

  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error("No memories found for this group");
  }

  await PendingMemory.updateOne({seniorEmail:email}, {$pull:{memoryGroupIds:memoryGroupId}});
  res.status(200).json({
    message: "Memory approved",
    updatedCount: result.modifiedCount,
  });
});

const getPublicIdFromUrl = (url) => {
  const uploadIndex = url.indexOf("/upload/");
  const pathWithVersion = url.slice(uploadIndex + 8);

  const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, "");

  return pathWithoutVersion.replace(/\.[^/.]+$/, "");
};

const deleteRequest = asyncHandler(async (req, res) => {
  const { memoryGroupId, email } = req.params;

  if (!memoryGroupId || !email) {
    res.status(400);
    throw new Error("Missing params");
  }

  const memories = await Memory.find({
    groupId: memoryGroupId,
    toBeAcceptedBy: email,
  });

  if (!memories.length) {
    res.status(404);
    throw new Error("No pending memories for this user");
  }

  // Claim the rejection before removing shared assets. A concurrent approval
  // may have already removed this member from the pending recipients.
  const removed = await Memory.deleteMany({groupId: memoryGroupId, toBeAcceptedBy: email});
  if (!removed.deletedCount) return res.status(409).json({message:"Decision already recorded"});
  await PendingMemory.updateMany({memoryGroupIds:memoryGroupId}, {$pull:{memoryGroupIds:memoryGroupId}});
  const assets = new Set(memories.flatMap((memory) => memory.images || []));
  await Promise.all(Array.from(assets, (idOrUrl) => storage.deleteImage(idOrUrl)));
  res.status(200).json({
    message: "Memory rejected",
    deletedCount: removed.deletedCount,
  });
});

// const memory_img = asyncHandler(async (req, res) => {
//     const user_email = req.body.user_email
//     const name = req.body.name
//     const memory_img = req.body.memory_img
//     console.log(memory_img)
//     const User = await Memories.find({ user_email: user_email }).exec()
//     try {
//       if (!User?.length) {
//         const NewUser = await Memories.create({ user_email, name })
//         const addImage = await Memories.findOneAndUpdate(
//           { _id: NewUser._id },
//           { $push: { memory_img: memory_img } },
//         )

//         return res.send({ message: 'Image Uploaded Successfully.' })
//       }
//       try {
//         const addImage = await Memories.findOneAndUpdate(
//           { _id: User[0]._id },
//           { $push: { memory_img: memory_img } },
//         )
//       } catch (err) {
//         console.log(err)
//       }

//       return res.send({ message: 'Image Upload Successfully.' })
//     } catch (err) {
//       console.log(err)
//     }
//   })

module.exports = {
  getMemories,
  createMemory,
  // memory_img,
  getPendingRequests,
  approveRequest,
  deleteRequest,
};
