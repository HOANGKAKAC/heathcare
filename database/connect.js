
import mongoose from "mongoose";

const mongoURI = "mongodb+srv://user:1IN9J82tDuR9hGFb@cluster0.o06ao.mongodb.net/hoang1?retryWrites=true&w=majority&appName=Cluster0";

// Kết nối MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.error("❌ Kết nối thất bại:", err));
// Định nghĩa Schema
// Định nghĩa Schema cho collection "cars"
const carSchema = new mongoose.Schema({
    ten: String,
    namsx: Number,
    hang: String,
    gia: Number
  }, { collection: "cars" }); // Chỉ định collection "cars"
  
  const Car = mongoose.model("Car", carSchema);
  
  // Truy vấn dữ liệu theo ID
  async function getCarById() {
    try {
      const car = await Car.findById("674975844ad76619fdfb5ddc");
      console.log("🚗 Dữ liệu lấy được:", car);
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu:", error);
    } finally {
      mongoose.connection.close();
    }
  }
  
  getCarById();
