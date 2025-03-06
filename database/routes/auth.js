import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// API Đăng ký người dùng
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại!" });

    // Tạo user mới
    const newUser = new User({ username, email, password });

    // Lưu vào database
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: { username, email } });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

export default router;
