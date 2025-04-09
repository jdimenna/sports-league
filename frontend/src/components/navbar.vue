<template>
  <nav class="navbar is-custom-blue" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item has-text-weight-bold is-size-5" :href="homeUrl">
        Sports Schedules
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navMenu"
        @click="toggleNavbar"
        :class="{ 'is-active': isActive }"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div :class="{ 'navbar-menu': true, 'is-active': isActive }" id="navMenu">
      <div class="navbar-start">
        <a class="navbar-item" :href="`${baseUrl}/`">Home</a>
        <a class="navbar-item" :href="`${baseUrl}/dashboard`">Dashboard</a>
        <a class="navbar-item" :href="`${baseUrl}/admin`">Edit Data</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    // Set base URL for production or development
    baseUrl() {
      return import.meta.env.MODE === 'development'
        ? 'http://localhost:5173' // or whichever port your local dev server uses
        : 'https://your-frontend-service.onrender.com'; // your Render frontend URL
    },
    homeUrl() {
      return import.meta.env.MODE === 'development'
        ? 'http://localhost:5173' // for local dev
        : 'https://your-frontend-service.onrender.com'; // your Render frontend URL
    },
  },
  methods: {
    toggleNavbar() {
      this.isActive = !this.isActive;
    },
  },
};
</script>

<style scoped>
.navbar.is-custom-blue {
  background-color: #1FE8F7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff !important;
}

.navbar-item {
  transition: background-color 0.3s ease;
}
</style>
