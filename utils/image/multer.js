// // multerConfig.js
// import multer from 'multer';
// import path from 'path';

// // Multer config with file type filtering
// const storage = multer.diskStorage({
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
//       cb(new Error('File type is not supported'), false);
//       return;
//     }
//     cb(null, true);
//   },
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filename
//   }
// });

// const upload = multer({ storage });

// export default upload;


import multer from 'multer';
import path from 'path';

// Multer config for images and videos
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.pdf', '.docx'];

  const ext = path.extname(file.originalname).toLowerCase();

  // Check if the file extension is allowed
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type is not supported'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
