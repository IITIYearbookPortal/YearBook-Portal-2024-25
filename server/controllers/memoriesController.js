const asyncHandler = require('express-async-handler');
const Memory = require('../models/memories');
const { randomUUID } = require('crypto');

const getMemories = asyncHandler(async (req, res) => {
  const { seniorId, seniorIds } = req.query;

  const filter = { isDeleted: false };

  if (seniorId) {
    filter.seniorId = seniorId;
  }

  if (seniorIds) {
    filter.seniorId = { $in: seniorIds.split(',') };
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
  const { locationId, seniorIds, content, authorName, images = [] } = req.body;

  if (
    !locationId ||
    !Array.isArray(seniorIds) ||
    seniorIds.length === 0 ||
    !content ||
    !authorName
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const groupId = randomUUID();

  const docs = seniorIds.map((seniorId) => ({
    locationId,
    seniorId,
    content,
    authorName,
    images,
    groupId,
  }));

  const memories = await Memory.insertMany(docs);

  const formattedMemories = memories.map((memory) => ({
    id: memory.id,
    locationId: memory.locationId,
    seniorId: memory.seniorId,
    authorName: memory.authorName,
    content: memory.content,
    images: memory.images,
    createdAt: memory.createdAt,
    groupId: memory.groupId,
  }));

  res.status(201).json(formattedMemories);
});


const getPendingRequests = asyncHandler(async (req, res) => {
  const filter = { isVerified: false };

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

const approveRequest = asyncHandler(async (req, res) => {
  const { memoryId } = req.params;

  const memory = await Memory.findById(memoryId);

  if (!memory) {
    res.status(404);
    throw new Error("Memory not found");
  }

  memory.isVerified = true;
  await memory.save();

  res.status(200).json({
    message: "Memory approved successfully",
  });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const { memoryId } = req.params;

  const memory = await Memory.findByIdAndDelete(memoryId);

  console.log('hi')

  if (!memory) {
    res.status(404);
    throw new Error("Memory not found");
  }

  res.status(200).json({
    message: "Memory request deleted successfully",
  });
});

const memory_img = asyncHandler(async (req, res) => {
    const user_email = req.body.user_email
    const name = req.body.name
    const memory_img = req.body.memory_img
    console.log(memory_img)
    const User = await Memories.find({ user_email: user_email }).exec()
    try {
      if (!User?.length) {
        const NewUser = await Memories.create({ user_email, name })
        const addImage = await Memories.findOneAndUpdate(
          { _id: NewUser._id },
          { $push: { memory_img: memory_img } },
        )
  
        return res.send({ message: 'Image Uploaded Successfully.' })
      }
      try {
        const addImage = await Memories.findOneAndUpdate(
          { _id: User[0]._id },
          { $push: { memory_img: memory_img } },
        )
      } catch (err) {
        console.log(err)
      }
  
      return res.send({ message: 'Image Upload Successfully.' })
    } catch (err) {
      console.log(err)
    }
  })

module.exports = {
  getMemories,
  createMemory,
  memory_img,
  getPendingRequests,
  approveRequest,
  deleteRequest,
}