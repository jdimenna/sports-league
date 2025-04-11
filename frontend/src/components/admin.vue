<template>
  <section class="section">
    <div class="container">
      <h2 class="title is-3">Manage Data</h2>
      <div class="box has-background-light">
        <div class="columns is-multiline is-centered">
          <div class="column is-one-third" v-for="(action, index) in actions" :key="index">
            <div class="card action-card">
              <div class="card-content has-text-centered">
                <p class="title is-5">{{ action.emoji }} {{ action.label }}</p>
                <button class="button is-custom-blue mt-3" @click="action.handler">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 
        <div class="mt-6">
          <h3 class="title is-5 has-text-danger">Danger Zone</h3>
          <button class="button is-danger" @click="confirmDelete('event', eventId)">❌ Delete Event</button>
        </div> 
        -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const secureMessage = ref('');
const userId = ref('');

onMounted(async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('https://sports-league-yepn.onrender.com/api/dashboard-data', {
      headers: { Authorization: `Bearer ${token}` }
    });
    secureMessage.value = response.data.message;
    userId.value = response.data.userId;
  } catch (err) {
    alert('Session expired or token invalid.');
    logout();
  }
});

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

// Navigation handlers
const navigateToAddLeague = () => router.push('/add-league');
const navigateToAddEvent = () => router.push('/add-event');
const navigateToAddUser = () => router.push('/add-user');
const navigateToDeleteEvent = () => router.push('/delete-event');

const actions = [
  { label: 'Add New League', emoji: '🏅', handler: navigateToAddLeague },
  { label: 'Add New Event', emoji: '🎯', handler: navigateToAddEvent },
  { label: 'Add New User', emoji: '🤸', handler: navigateToAddUser },
  { label: 'Delete Event', emoji: '❌', handler: navigateToDeleteEvent },
];
</script>

<style scoped>
.button.is-custom-blue {
  background-color: #1FE8F7;
  color: white;
  border-color: #1FE8F7;
}

.button.is-custom-blue:hover {
  background-color: #17c7d6;
  border-color: #17c7d6;
}

.button.is-danger {
  background-color: #ff3860;
  color: white;
  border-color: #ff3860;
}

.button.is-danger:hover {
  background-color: #ff3b52;
  border-color: #ff3b52;
}

.action-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 12px;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
