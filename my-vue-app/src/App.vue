<template>
  <div id="app">
    <AppHeader />
    <AppBanner />
    <router-view/>
    <AppFooter id="footer"/>
  </div>
</template>

<script>
import AppHeader from './views/Header.vue';
import AppBanner from './views/Banner.vue';
import AppFooter from './views/Footer.vue';
export default {
  name: 'App',
  components: {
    AppHeader,
    AppBanner,
    AppFooter,
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>