<template>
  <div class="image-slider">
    <h1 class="page-title">Hình ảnh Nổi bật Y tế</h1>
    <div class="slider-container">
      <button class="arrow prev" @click="prevImage">←</button>
      <div class="slider-content">
        <img :src="currentImage.image" :alt="currentImage.name" class="slider-image" />
        <div class="slider-info">
          <h2 class="slider-title">{{ currentImage.name }}</h2>
          <p class="slider-description">{{ currentImage.description }}</p>
        </div>
      </div>
      <button class="arrow next" @click="nextImage">→</button>
    </div>
    <div class="medical-icons">
      <i class="fas fa-heartbeat"></i>
      <i class="fas fa-stethoscope"></i>
      <i class="fas fa-file-medical"></i>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageSliderView',
  data() {
    return {
      images: [
        {
          name: 'Dây đeo vai thông minh',
          image: 'https://drive.google.com/uc?export=download&id=1VLgtGV3PgESJcLofsBNUFLimb9SY9s2P',
          description: 'Hỗ trợ tư thế và giảm đau vai hiệu quả.',
        },
        {
          name: 'Máy đo huyết áp',
          image: 'https://drive.google.com/uc?export=download&id=1VLgtGV3PgESJcLofsBNUFLimb9SY9s2P',
          description: 'Thiết bị đo huyết áp chính xác tại nhà.',
        },
        {
          name: 'Khẩu trang y tế',
          image: 'https://drive.google.com/uc?export=download&id=1VLgtGV3PgESJcLofsBNUFLimb9SY9s2P',
          description: 'Bảo vệ sức khỏe với khẩu trang chất lượng cao.',
        },
      ],
      currentIndex: 0,
      intervalId: null,
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    startAutoSlide() {
      this.intervalId = setInterval(() => {
        this.nextImage();
      }, 5000); // Tự động chuyển sau 5 giây
    },
    stopAutoSlide() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    },
    // Nếu muốn lấy dữ liệu từ backend (MedicalProduct hoặc News)
    async fetchImages() {
      try {
        const response = await axios.get('http://localhost:5000/api/medical-products');
        this.images = response.data.map(product => ({
          name: product.name,
          image: product.image || 'https://via.placeholder.com/300x300?text=No+Image',
          description: product.description,
        }));
      } catch (error) {
        console.error('Lỗi lấy danh sách hình ảnh:', error);
      }
    },
  },
};
</script>

<style scoped>
.image-slider {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 2px solid #f4f4f4;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%; /* Đảm bảo container chiếm toàn bộ chiều rộng */
  max-width: 1200px; /* Giới hạn chiều rộng tối đa cho nội dung */
  margin: 0 auto; /* Canh giữa container */
}

.slider-content {
  max-width: 800px;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.slider-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-bottom: 2px solid #007bff;
}

.slider-info {
  padding: 20px;
}

.slider-title {
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.slider-description {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}

.arrow {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.arrow:hover {
  background: #0056b3;
}

.prev {
  position: absolute;
  left: 20px; /* Điều chỉnh vị trí mũi tên trái */
}

.next {
  position: absolute;
  right: 20px; /* Điều chỉnh vị trí mũi tên phải */
}

.medical-icons {
  position: absolute;
  top: 20px;
  right: 20px;
  opacity: 0.2;
  color: #87CEEB;
  font-size: 40px;
  display: flex;
  gap: 15px;
}

/* Thêm icons từ FontAwesome */
.medical-icons i {
  transition: opacity 0.3s ease;
}

.medical-icons i:hover {
  opacity: 0.5;
}
</style>