<template>
  <div class="profile">
    <h1>Thông tin cá nhân</h1>
    
    <div v-if="loading" class="loading">
      Đang tải thông tin...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <form v-else @submit.prevent="updateProfile" class="profile-form">
      <div class="form-group">
        <label for="fullname">Họ và tên</label>
        <input
          type="text"
          id="fullname"
          v-model="userInfo.fullname"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="userInfo.email"
          disabled
        />
      </div>

      <div class="form-group">
        <label for="age">Tuổi</label>
        <input
          type="number"
          id="age"
          v-model="userInfo.age"
        />
      </div>

      <div class="form-group">
        <label for="gender">Giới tính</label>
        <select id="gender" v-model="userInfo.gender">
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>

      <div class="form-group">
        <label for="phone">Số điện thoại</label>
        <input
          type="tel"
          id="phone"
          v-model="userInfo.phone"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isUpdating">
          {{ isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      userInfo: {
        fullname: '',
        email: '',
        age: null,
        gender: '',
        phone: ''
      },
      loading: true,
      error: null,
      isUpdating: false
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        console.log('=== Bắt đầu lấy thông tin user ===');
        
        const token = localStorage.getItem('token');
        console.log('Token trong localStorage:', token ? 'Có token' : 'Không có token');
        
        if (!token) {
          console.log('Không tìm thấy token, chuyển hướng về trang đăng nhập');
          this.error = 'Vui lòng đăng nhập để xem thông tin!';
          this.$router.push('/login');
          return;
        }

        console.log('Chuẩn bị gửi request với headers:', {
          Authorization: 'Bearer ' + token.substring(0, 20) + '...',
          'Content-Type': 'application/json'
        });

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response từ server:', response.data);

        if (response.data) {
          this.userInfo = response.data;
          console.log('Đã cập nhật thông tin user:', this.userInfo);
          this.loading = false;
        } else {
          console.error('Response không có data');
          throw new Error('Không nhận được dữ liệu từ server');
        }
      } catch (error) {
        console.error('=== LỖI KHI LẤY THÔNG TIN ===');
        console.error('Chi tiết lỗi:', error);
        
        if (error.response) {
          console.log('Status:', error.response.status);
          console.log('Headers:', error.response.headers);
          console.log('Data:', error.response.data);
          
          if (error.response.status === 401) {
            console.log('Token hết hạn hoặc không hợp lệ, đăng xuất...');
            this.error = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!';
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            this.$router.push('/login');
          } else if (error.response.status === 404) {
            this.error = 'Không tìm thấy thông tin người dùng!';
          } else {
            this.error = error.response.data.message || 'Lỗi khi tải thông tin!';
          }
        } else if (error.request) {
          console.log('Không nhận được response từ server:', error.request);
          this.error = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối!';
        } else {
          console.log('Lỗi không xác định:', error.message);
          this.error = error.message || 'Đã xảy ra lỗi không xác định!';
        }
        this.loading = false;
      }
    },
    async updateProfile() {
      try {
        this.isUpdating = true;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vui lòng đăng nhập để cập nhật thông tin!');
        }

        const response = await axios.put(
          'http://localhost:5000/api/users/profile',
          {
            fullname: this.userInfo.fullname,
            age: this.userInfo.age,
            gender: this.userInfo.gender,
            phone: this.userInfo.phone
          },
          {
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data.user) {
          this.userInfo = response.data.user;
          alert('Cập nhật thông tin thành công!');
        } else {
          throw new Error('Không nhận được phản hồi từ server');
        }
      } catch (error) {
        console.error('Chi tiết lỗi cập nhật:', error);
        if (error.response) {
          if (error.response.status === 401) {
            alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            this.$router.push('/login');
          } else {
            alert(error.response.data.message || 'Không thể cập nhật thông tin!');
          }
        } else {
          alert(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin!');
        }
      } finally {
        this.isUpdating = false;
      }
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-group input:focus,
.form-group select:focus {
  border-color: gold;
  outline: none;
}

.submit-btn {
  padding: 12px;
  background: gold;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #ffd700;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.error-message {
  color: #ff4444;
  text-align: center;
  padding: 20px;
  background: #ffebee;
  border-radius: 5px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .profile {
    margin: 20px;
  }
}
</style>