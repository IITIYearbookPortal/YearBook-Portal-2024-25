const asyncHandler = require('express-async-handler');
const Memory = require('../models/memories');
const { randomUUID } = require('crypto');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const getMemories = asyncHandler(async (req, res) => {
  const { seniorId, seniorIds } = req.query;

  const filter = { isDeleted: false,isVerified:true };

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
  const { locationId, content, authorName } = req.body;
  let { seniorIds } = req.body;

  if (!locationId || !content || !authorName || !seniorIds) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  seniorIds = JSON.parse(seniorIds);
  if (!Array.isArray(seniorIds) || seniorIds.length === 0) {
    return res.status(400).json({ error: 'Invalid seniorIds' });
  }

  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'yearbook/memories',
            resource_type: 'image', 
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
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
    isVerified : false,
  }));

  const memories = await Memory.insertMany(docs);

  const formatted = memories.map((m) => ({
    id: m.id,
    locationId: m.locationId,
    seniorId: m.seniorId,
    authorName: m.authorName,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
    groupId: m.groupId,
    isVerified : false,
  }));

  res.status(201).json(formatted);
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

const getPublicIdFromUrl = (url) => {
  const uploadIndex = url.indexOf('/upload/');
  const pathWithVersion = url.slice(uploadIndex + 8);

  const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');

  return pathWithoutVersion.replace(/\.[^/.]+$/, '');
};


const deleteRequest = asyncHandler(async (req, res) => {
  const { memoryId } = req.params;

  const memory = await Memory.findById(memoryId);

  if (!memory) {
    res.status(404);
    throw new Error('Memory not found');
  }

  if (memory.images && memory.images.length > 0) {
    const deletePromises = memory.images.map((imgUrl) => {
      const publicId = getPublicIdFromUrl(imgUrl);
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);
  }

  await Memory.findByIdAndDelete(memoryId);

  res.status(200).json({
    message: 'Memory request and images deleted successfully',
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
}