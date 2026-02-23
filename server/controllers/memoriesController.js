const asyncHandler = require("express-async-handler");
const Memory = require("../models/memories");
const { randomUUID } = require("crypto");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const PendingMemory = require("../models/pendingMemories.js");

const getMemories = asyncHandler(async (req, res) => {
  const { seniorId, seniorIds } = req.query;

  const filter = { isDeleted: false };

  if (seniorId) {
    filter.seniorId = seniorId;
  }

  if (seniorIds) {
    filter.seniorId = { $in: seniorIds.split(",") };
  }

  const memories = await Memory.find(filter).sort({ createdAt: -1 });

  const response = memories.map((m) => ({
    id: m.id,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
  }));

  res.json(response);
});

const createMemory = asyncHandler(async (req, res) => {
  const { locationId, content, authorName } = req.body;
  let { seniorIds } = req.body;

  //seniorsId is an array consisting targeting seniors emails as strings

  // console.log(req.body);

  if (!locationId || !content || !authorName || !seniorIds) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  seniorIds = JSON.parse(seniorIds);
  if (!Array.isArray(seniorIds) || seniorIds.length === 0) {
    return res.status(400).json({ error: "Invalid seniorIds" });
  }

  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "yearbook/memories",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    imageUrls = await Promise.all(uploadPromises);
  }

  const groupId = randomUUID();

  const docs = seniorIds.map((seniorId) => ({
    locationId,
    seniorId,
    content,
    authorName,
    images: imageUrls,
    groupId,
    // isVerified : false,
    toBeAcceptedBy: seniorIds,
  }));

  const memories = await Memory.insertMany(docs);

  for (const memory of memories) {
    await PendingMemory.updateOne(
      { seniorEmail: memory.seniorId },
      { $addToSet: { memoryIds: memory._id } },
      { upsert: true },
    );
  }
  const formatted = memories.map((m) => ({
    id: m.id,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
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
  }).select("memoryIds");

  if (!pending || !pending.memoryIds.length) {
    return res.json([]);
  }

  const memories = await Memory.aggregate([
    {
      $match: {
        _id: { $in: pending.memoryIds },
        seniorId: email,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$groupId",
        doc: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$doc" },
    },
  ]);

  console.log(memories);

  const response = memories.map((m) => ({
    id: m._id,
    groupId: m.groupId,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
  }));

  res.json(response);
});

const approveRequest = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const result = await Memory.updateMany(
    { groupId },
    { $set: { isVerified: true } },
  );

  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error("No memories found for this group");
  }

  res.status(200).json({
    message: "Memories approved successfully",
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
  const { groupId } = req.params;

  const memories = await Memory.find({ groupId });

  if (!memories || memories.length === 0) {
    res.status(404);
    throw new Error("Memories not found");
  }

  const deletePromises = [];

  memories.forEach((memory) => {
    if (memory.images && memory.images.length > 0) {
      memory.images.forEach((imgUrl) => {
        const publicId = getPublicIdFromUrl(imgUrl);
        deletePromises.push(cloudinary.uploader.destroy(publicId));
      });
    }
  });

  if (deletePromises.length > 0) {
    await Promise.all(deletePromises);
  }

  await Memory.deleteMany({ groupId });

  res.status(200).json({
    message: "Memory requests and images deleted successfully",
    deletedCount: memories.length,
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
