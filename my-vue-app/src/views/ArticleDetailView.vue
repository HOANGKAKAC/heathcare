<template>
    <div class="article-detail">
      <router-link to="/news-events" class="back-link">← Quay lại Tin t���c</router-link>
      <h1 class="article-title">{{ article.title }}</h1>
      <p class="article-meta">
        <span class="date">{{ formatDate(article.date) }}</span>
        <span class="author" v-if="article.author">bởi {{ article.author }}</span>
      </p>
      <img
        :src="article.image || 'https://via.placeholder.com/800x400'"
        alt="Article Image"
        class="article-image"
        v-if="article.image"
      />
      <div class="article-content" v-html="article.content"></div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ArticleDetailView',
    data() {
      return {
        article: {},
      };
    },
    mounted() {
      this.fetchArticle();
    },
    methods: {
      async fetchArticle() {
        try {
          const id = this.$route.params.id;
          const response = await axios.get(`http://localhost:5000/api/news/${id}`);
          this.article = response.data;
        } catch (error) {
          console.error('Lỗi lấy chi tiết bài viết:', error);
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .article-detail {
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .back-link {
    display: inline-block;
    margin-bottom: 20px;
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  .article-title {
    font-size: 32px;
    font-weight: 700;
    color: #222;
    margin-bottom: 15px;
  }
  
  .article-meta {
    font-size: 16px;
    color: #777;
    margin-bottom: 20px;
  }
  
  .article-meta .date,
  .article-meta .author {
    margin-right: 10px;
  }
  
  .article-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .article-content {
    font-size: 18px;
    color: #333;
    line-height: 1.6;
  }
  </style>