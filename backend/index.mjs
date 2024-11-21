import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Get current directory for file storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/javascript",
    "text/javascript",
    "text/plain",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const isPrime = (num) => {
  const n = Number(num);
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

app
  .route("/bfhl")
  .get((req, res) => {
    res.status(200).json({ operation_code: 1 });
  })
  .post(upload.single("file"), (req, res) => {
    try {
      const { data = [] } = req.body;

      // Validate input
      if (!Array.isArray(data)) {
        return res.status(400).json({
          is_success: false,
          error: "Invalid data format. 'data' must be an array.",
        });
      }

      const numbers = [];
      const alphabets = [];
      let highest_lowercase_alphabet = "";

      data.forEach((item) => {
        if (typeof item === "string" || typeof item === "number") {
          if (!isNaN(item)) {
            numbers.push(item);
          } else if (item.length === 1) {
            alphabets.push(item);
            if (
              item === item.toLowerCase() &&
              (!highest_lowercase_alphabet || item > highest_lowercase_alphabet)
            ) {
              highest_lowercase_alphabet = item;
            }
          }
        }
      });

      const is_prime_found = numbers.some(isPrime);

      let file_valid = false;
      let file_mime_type = null;
      let file_size_kb = null;

      if (req.file) {
        file_valid = true;
        file_mime_type = req.file.mimetype;
        file_size_kb = Math.round(req.file.size / 1024).toString();
      }

      res.json({
        is_success: true,
        user_id: "Mruthunjay_Parmar_28052003",
        email: "mruthunjayparmar0@gmail.com",
        roll_number: "21100BTCSAII09431",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highest_lowercase_alphabet
          ? [highest_lowercase_alphabet]
          : [],
        is_prime_found,
        file_valid,
        file_mime_type,
        file_size_kb,
      });
    } catch (error) {
      res.status(500).json({
        is_success: false,
        error: "Internal server error",
        details: error.message,
      });
    }
  });

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
