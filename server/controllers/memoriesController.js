const asyncHandler = require('express-async-handler');
const Memory = require('../models/memories');

const getMemoriesBySenior = asyncHandler(async (req, res) => {
  const { seniorId } = req.params;
  const filter = { isDeleted: false };
  if (seniorId) filter.seniorId = seniorId;

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

const getPendingRequests = asyncHandler(async (req, res) => {
  const filter = { isVerified: false };

  console.log('ji');

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
  const { locationId, seniorId, content, authorName } = req.body;

  if (!locationId || !seniorId || !content || !authorName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const memory = await Memory.create({
    locationId,
    seniorId,
    content,
    authorName,
  });
  res.status(201).json({
    id: memory.id,
    locationId: memory.locationId,
    seniorId: memory.seniorId,
    authorName: memory.authorName,
    content: memory.content,
    images: memory.images,
    createdAt: memory.createdAt,
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
  getMemoriesBySenior,
  createMemory,
  memory_img,
  getPendingRequests,
}