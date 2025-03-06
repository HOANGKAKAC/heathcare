<template>
    <div class="admin-add-news">
      <h1>Thêm Bài viết Mới</h1>
      <form @submit.prevent="addNews" class="news-form">
        <div class="form-group">
          <label for="title">Tiêu đề</label>
          <input v-model="form.title" id="title" placeholder="Nhập tiêu đề" required />
        </div>
        <div class="form-group">
          <label for="summary">Tóm tắt</label>
          <textarea v-model="form.summary" id="summary" placeholder="Nhập tóm tắt"></textarea>
        </div>
        <div class="form-group">
          <label for="content">Nội dung</label>
          <vue-quill-editor v-model="form.content" :options="editorOptions" />
        </div>
        <div class="form-group">
          <label for="author">Tác giả</label>
          <input v-model="form.author" id="author" placeholder="Nhập tên tác giả" />
        </div>
        <button type="submit" class="submit-btn">Đăng bài</button>
      </form>
    </div>
  </template>
  
  <script>
  import { VueQuillEditor } from 'vue-quill-editor';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import axios from 'axios';
  
  export default {
    components: { VueQuillEditor },
    data() {
      return {
        form: {
          title: '',
          summary: '',
          content: '',
          author: '',
        },
        editorOptions: {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'header': [1, 2, 3, false] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link'],
              ['clean'],
            ],
          },
        },
      };
    },
    methods: {
      async addNews() {
        try {
          const token = localStorage.getItem('token');
          console.log(token);
          await axios.post('http://localhost:5000/api/news', this.form, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert('Thêm bài viết thành công!');
          this.$router.push('/news-events');
        } catch (error) {
          console.error('Lỗi thêm bài viết:', error);
          alert('Thêm bài viết thất bại: ' + (error.response?.data.message || error.message));
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-add-news {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
  }
  
  h1 {
    font-size: 28px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .news-form {
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
  .form-group textarea {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .form-group textarea {
    height: 100px;
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
  </style>