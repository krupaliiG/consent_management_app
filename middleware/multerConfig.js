const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
