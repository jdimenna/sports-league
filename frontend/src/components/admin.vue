<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-3">Select Action</h2>
      
      <div class="container">
        <!-- Add New buttons -->
        <button class="button is-custom-blue has-text-black" @click="navigateToAddLeague">
          🏅 Add New League
        </button>

        <button class="button is-custom-blue has-text-black" @click="navigateToAddEvent">
          🎯 Add New Event
        </button>

        <button class="button is-custom-blue has-text-black" @click="navigateToAddUser">
          🤸 Add New User
        </button>

        <!-- Delete buttons -->
        <!-- <button class="button is-danger has-text-black" @click="confirmDelete('event', eventId)">
          ❌ Delete Event
        </button>

        <button class="button is-danger has-text-black" @click="confirmDelete('league', leagueId)">
          ❌ Delete League
        </button>

        <button class="button is-danger has-text-black" @click="confirmDelete('user', userId)">
          ❌ Delete User
        </button> -->
      </div>
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
  // const eventId = ref('');  // Assuming you have the eventId available
  // const leagueId = ref('');  // Assuming you have the leagueId available
  // const userIdToDelete = ref('');  // Assuming you have the userId to delete

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Fetch user data
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

  // Navigation to add new entities
  const navigateToAddLeague = () => {
    router.push('/add-league');
  };

  const navigateToAddEvent = () => {
    router.push('/add-event');
  };

  const navigateToAddUser = () => {
    router.push('/add-user');
  };

  // Function to confirm deletion
  // const confirmDelete = (type, id) => {
  //   const confirmation = window.confirm(`Are you sure you want to delete this ${type}?`);
  //   if (confirmation) {
  //     deleteItem(type, id);
  //   }
  // };

  // // Function to delete an item (event, league, or user)
  // const deleteItem = async (type, id) => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const response = await axios.delete(`https://sports-league-yepn.onrender.com/api/delete-${type}/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     if (response.status === 200) {
  //       alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
  //       // Optionally, redirect or refresh page after deletion
  //       router.push('/dashboard'); // Example: Redirect to dashboard after deletion
  //     }
  //   } catch (err) {
  //     alert(`Failed to delete the ${type}.`);
  //     console.error(err);
  //   }
  // };
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

.button.is-danger {
  background-color: #ff3860;
  color: white;
  border-color: #ff3860;
}

.button.is-danger:hover {
  background-color: #ff3b52;
  border-color: #ff3b52;
}

.button {
  margin-right: 20px;
  margin-bottom: 20px;
  width: 200px;
  text-align: left;
}
</style>
