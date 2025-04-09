<template>
  <nav class="navbar is-custom-blue" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item has-text-weight-bold is-size-5" href="/">
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
        <a class="navbar-item" href="/">Home</a>
        <a class="navbar-item" href="/dashboard">Dashboard</a>
        <a class="navbar-item" href="/admin">Edit Data</a>
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
  methods: {
    toggleNavbar() {
      this.isActive = !this.isActive;
    },
  },
};
</script>

<style scoped>
/* Custom Blue Navbar with #1FE8F7 */
.navbar.is-custom-blue {
  background-color: #1FE8F7; /* New blue color */
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
