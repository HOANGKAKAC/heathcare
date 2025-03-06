import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from "../views/RegisterView.vue";
import LoginView from '@/views/LoginView.vue';
import NewsEventsView from '../views/NewsEventsView.vue';
import ArticleDetailView from '../views/ArticleDetailView.vue';
import AdminAddNews from '../adminViews/AdminAddNews.vue';
import ProfileView from '@/views/ProfileView.vue';
import Hero from '@/views/Hero.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/",
      name: 'Home',
      component: Hero
    },
    {
      path:"/Register",
      name: 'RegisterView ',
      component: RegisterView 
    },
    {
      path: "/Login", 
      name: 'login',
      component: LoginView
    },
    { path: '/news-events', name: 'NewsEvents', component: NewsEventsView },
    { path: '/news/:id', name: 'ArticleDetail', component: ArticleDetailView },
    { path: '/admin/add-news', name: 'AdminAddNews', component: AdminAddNews, meta: { requiresAdmin: true } },
    { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  ],
})

export default router
