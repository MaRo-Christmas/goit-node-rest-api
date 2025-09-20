import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const userId = req.user?.id || "anon";
    const ext = path.extname(file.originalname || "");
    cb(null, `${userId}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default upload;
