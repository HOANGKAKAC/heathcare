import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { jwtDecode } from 'jwt-decode';

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(cors({ origin: "http://localhost:5173" }));

// Kết nối MongoDB Atlas
connect(
  "mongodb+srv://user:1IN9J82tDuR9hGFb@cluster0.o06ao.mongodb.net/hoang1?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Mô hình User (Schema)
const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
  gender: { type: String, required: false },
  phone: { type: String, required: false },
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", UserSchema, "users");

// Mô hình News (Schema) - Bỏ image
const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  date: { type: Date, default: Date.now },
  author: { type: String },
});

const News = mongoose.model("News", NewsSchema, "news");

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  console.log('Auth Header:', authHeader);
  console.log('Token:', token);
  
  if (!token) return res.status(401).json({ message: "Không có token!" });

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }
    console.log('Decoded user:', user);
    req.user = user;
    next();
  });
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  User.findById(req.user.userId)
    .then((user) => {
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Chỉ admin mới có quyền!" });
      }
      next();
    })
    .catch((err) => res.status(500).json({ message: "Lỗi server!", error: err.message }));
};

// API Đăng ký người dùng
app.post("/api/users/register", async (req, res) => {
  try {
    const { fullname, email, password, age, gender, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      age: age || null,
      gender: gender || null,
      phone: phone || null,
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API Đăng nhập
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

    const token = jwt.sign({ userId: user._id, role: user.role }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API: Lấy tất cả bài viết
app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API: Thêm bài viết mới (yêu cầu admin) - Bỏ image
app.post("/api/news", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, content, summary, author } = req.body;
    const newArticle = new News({ title, content, summary, author });
    await newArticle.save();
    res.status(201).json({ message: "Thêm bài viết thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API: Lấy chi tiết bài viết theo ID
app.get("/api/news/:id", async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Bài viết không tồn tại!" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API: Lấy thông tin cá nhân của user
app.get("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    console.log('Finding user with ID:', req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    console.log('Found user:', user);
    res.json(user);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API: Cập nhật thông tin cá nhân
app.put("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const { fullname, age, gender, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { fullname, age, gender, phone },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.json({ message: "Cập nhật thành công!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// Route gốc
app.get("/", (req, res) => {
  res.send("🚀 Server đang chạy!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));