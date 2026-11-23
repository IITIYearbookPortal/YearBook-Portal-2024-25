const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
    fields: 20,
    fieldSize: 16 * 1024,
    parts: 24,
  },
});

let activeUploads = 0;
function limitConcurrentUploads(req, res, next) {
  if (activeUploads >= 8) {
    res.set("Retry-After", "2");
    return res.status(503).json({ message: "Uploads are busy. Try again shortly." });
  }
  activeUploads += 1;
  function release() {
    res.removeListener("finish", release);
    res.removeListener("close", release);
    activeUploads -= 1;
  }
  res.once("finish", release);
  res.once("close", release);
  next();
}

module.exports = { upload, limitConcurrentUploads };
