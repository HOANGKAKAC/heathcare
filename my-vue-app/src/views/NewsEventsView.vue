<template>
    <div class="news-events">
      <h1 class="page-title">Tin tức & Kiến thức</h1>
      <div class="articles-container">
        <div v-for="article in articles" :key="article._id" class="article-card">
          <img
            :src="article.image || 'https://via.placeholder.com/300x150'"
            alt="Article Image"
            class="article-image"
          />
          <div class="article-content">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-date">{{ formatDate(article.date) }}</p>
            <p class="article-summary">{{ article.summary || article.content.substring(0, 100) + '...' }}</p>
            <router-link :to="'/news/' + article._id" class="read-more">Xem thêm</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'NewsEventsView',
    data() {
      return {
        articles: [],
      };
    },
    mounted() {
      this.fetchArticles();
    },
    methods: {
      async fetchArticles() {
        try {
          const response = await axios.get('http://localhost:5000/api/news');
          this.articles = response.data;
        } catch (error) {
          console.error('Lỗi lấy danh sách bài viết:', error);
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
  .news-events {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-title {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .articles-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }
  
  .article-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .article-card:hover {
    transform: translateY(-5px);
  }
  
  .article-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .article-content {
    padding: 15px;
  }
  
  .article-title {
    font-size: 20px;
    font-weight: 600;
    color: #222;
    margin: 0 0 10px;
  }
  
  .article-date {
    font-size: 14px;
    color: #777;
    margin-bottom: 10px;
  }
  
  .article-summary {
    font-size: 16px;
    color: #555;
    margin-bottom: 15px;
  }
  
  .read-more {
    display: inline-block;
    padding: 8px 15px;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  }
  
  .read-more:hover {
    background: #0056b3;
  }
  </style>