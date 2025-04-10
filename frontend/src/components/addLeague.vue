<template>
    <div class="section">
      <div class="container">
        <h2 class="title is-3">Add League</h2>
  
        <p v-if="submissionMessage" class="notification is-custom-blue">
          {{ submissionMessage }}
        </p>
  
        <form @submit.prevent="addNewLeague">
          <div class="field">
            <label class="label" for="name">League Name</label>
            <div class="control">
              <input
                id="name"
                class="input"
                v-model="leagueData.name"
                type="text"
                placeholder="League Name"
                required
              />
            </div>
          </div>
  
          <div class="field">
            <div class="control">
              <button class="button is-custom-blue has-text-black" type="submit">Add League</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const leagueData = ref({
    name: '',
  });
  
  const submissionMessage = ref('');
  
  const addNewLeague = async () => {
    try {
      const response = await axios.post('https://sports-league-yepn.onrender.com/api/new-league', leagueData.value);
      submissionMessage.value = 'League added successfully!';
      leagueData.value = { name: '' };
    } catch (err) {
      submissionMessage.value = 'Failed to add league.';
      console.error('Error adding league:', err);
    }
  };
  </script>
  
  <style scoped>
  form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .field {
    margin-bottom: 1.5rem;
  }
  
  .button.is-custom-blue {
    background-color: #1FE8F7;
    color: white;
    border-color: #1FE8F7;
  }
  
  .button.is-custom-blue:hover {
    background-color: #17c7d6;
    border-color: #17c7d6;
  }

  .notification.is-custom-blue {
  background-color: #71f2fc;
  color: black;
  border-color: #71f2fc;
}
  </style>
  