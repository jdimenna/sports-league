<template>
    <div class="section">
      <div class="container">
        <h2 class="title is-3">Select Action</h2>
        
        <div class="container">
            <button class="button is-custom-blue has-text-black" @click="navigateToAddLeague">
            🏅 Add New League
            </button>
    
            <button class="button is-custom-blue has-text-black" @click="navigateToAddEvent">
                🎯 Add New Event
            </button>

            <button class="button is-custom-blue has-text-black" @click="navigateToAddUser">
                🤸 Add New User
            </button>
        </div>

        <!-- <div class="container">
            <button class="button is-custom-blue has-text-black" @click="navigateToAddLeague">
                ❌ Remove Item
            </button>
     -->
            <!-- <button class="button is-custom-blue has-text-black" @click="navigateToAddEvent">
                🎯 Remove Event
            </button>

            <button class="button is-custom-blue has-text-black" @click="navigateToAddUser">
                🤸 Remove User
            </button> -->
        <!-- </div> -->
        
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const secureMessage = ref('');
  const userId = ref('');
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };
  
  // Fetch user data on mounted
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
  
  const navigateToAddLeague = () => {
    router.push('/add-league');
  };
  
  const navigateToAddEvent = () => {
    router.push('/add-event');
  };

  const navigateToAddUser = () => {
    router.push('/add-user');
  };
  </script>
  
  <style scoped>
  .button.is-custom-blue {
    background-color: #1FE8F7;
    color: white;
    border-color: #1FE8F7;
  }
  
  .button.is-custom-blue:hover {
    background-color: #17c7d6; /* Slightly darker blue on hover */
    border-color: #17c7d6;
  }

  .button{
    margin-right: 20px;
    margin-bottom: 20px;
    width: 200px;
    text-align: left;
  }
  </style>
  