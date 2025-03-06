<template>
  <header>
    <div class="logo">HEALTH<span>RIGHT</span></div>
    <nav>
      <ul>
        <router-link to="/">Trang chủ</router-link> 
        <router-link to="/news-events">Tin tức</router-link>
        <router-link to="/admin/add-news">Thêm tin</router-link>
        <div class="auth-links">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="profile-link">
              <i class="fas fa-user"></i>
            </router-link>
            <button @click="logout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">
              <i class="fas fa-sign-in-alt"></i>
              Đăng nhập
            </router-link>
          </template>
        </div>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      isLoggedIn: false
    }
  },
  mounted() {
    // Thêm Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
    
    // Kiểm tra trạng thái đăng nhập
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },
    async logout() {
      // Xóa token và role
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.isLoggedIn = false;

      // Nếu đang không ở trang chủ thì chuyển về trang chủ
      if (this.$route.path !== '/') {
        await this.$router.push('/');
      }
    }
  },
  created() {
    // Lắng nghe sự kiện đăng nhập từ LoginView
    window.addEventListener('login-success', () => {
      this.checkLoginStatus();
    });
  }
};
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 2px solid #f4f4f4;
  z-index: 1000;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo span {
  color: gold;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  padding: 0;
}

nav ul a {
  text-decoration: none;
  color: black;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

nav ul a:hover {
  color: gold;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 15px;
  padding-left: 15px;
  border-left: 2px solid #f4f4f4;
}

.profile-link {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f4f4f4;
  transition: all 0.3s ease;
}

.profile-link:hover {
  background: gold;
  color: white;
}

.login-btn {
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: transparent;
  border: 2px solid gold;
}

.login-btn:hover {
  background: gold;
  color: white;
}

.login-btn i {
  color: inherit;
}

.logout-btn {
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: transparent;
  border: 2px solid #ff4444;
  color: #ff4444;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #ff4444;
  color: white;
}

.logout-btn i {
  color: inherit;
}

@media (max-width: 768px) {
  nav ul {
    gap: 10px;
  }
  
  .auth-links {
    margin-left: 10px;
    padding-left: 10px;
  }
  
  .login-btn, .logout-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>