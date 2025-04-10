<template>
  <nav class="navbar is-custom-blue" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item has-text-weight-bold is-size-5" to="/">
        Sports Schedules
      </router-link>

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
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/dashboard">Dashboard</router-link>
        <router-link class="navbar-item" to="/admin">Manage</router-link>
      </div>
    </div>
<!-- 
    <div class="navbar-end">
        <div class="navbar-item">
          <span class="has-text-weight-semibold">
            {{ user?.username || 'Guest' }}
          </span>
        </div>
      </div> -->
  </nav>
</template>

<script>

export default {
  data() {
    return {
      isActive: false
    };
  },
  methods: {
    toggleNavbar() {
      this.isActive = !this.isActive;
    },
  }
};
</script>

<style scoped>
.navbar.is-custom-blue {
  background-color: #1FE8F7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #2e333c;
}

.navbar-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff !important;
}

.navbar-item {
  transition: background-color 0.3s ease;
  color: #2e333c;
}
</style>
