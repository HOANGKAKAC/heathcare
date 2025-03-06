<template>
  <div class="register">
    <h1>Đăng ký</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="fullname">Họ và Tên</label>
        <input
          type="text"
          id="fullname"
          v-model="form.fullname"
          placeholder="Nhập họ và tên"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Nhập email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Xác nhận mật khẩu</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Xác nhận mật khẩu"
          required
        />
      </div>
      <div class="form-group">
        <label for="age">Tuổi</label>
        <input
          type="number"
          id="age"
          v-model.number="form.age"
          placeholder="Nhập tuổi"
          min="1"
          max="150"
        />
      </div>
      <div class="form-group">
        <label for="gender">Giới tính</label>
        <select id="gender" v-model="form.gender">
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
          v-model="form.phone"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div class="form-group checkbox">
        <input
          type="checkbox"
          id="terms"
          v-model="form.terms"
          required
        />
        <label for="terms">
          Tôi đồng ý với <router-link to="/policy">Điều khoản và Chính sách bảo mật</router-link>
        </label>
      </div>
      <button type="submit" class="submit-btn">Đăng ký</button>
    </form>
    <p class="login-link">
      Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: null,
        gender: '',
        phone: '',
        terms: false,
      },
    };
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          fullname: this.form.fullname,
          email: this.form.email,
          password: this.form.password,
          age: this.form.age,
          gender: this.form.gender,
          phone: this.form.phone,
        });
        console.log('Đăng ký thành công:', response.data);
        this.$router.push('/login'); // Chuyển hướng sang đăng nhập
      } catch (error) {
        console.error('Lỗi đăng ký:', error);
        alert('Đăng ký thất bại, vui lòng thử lại!');
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.checkbox label {
  font-size: 14px;
  color: #333;
}

.submit-btn {
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #0056b3;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}
</style>