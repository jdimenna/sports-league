<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-3">Add Event</h2>

      <p v-if="submissionMessage" class="notification is-custom-blue">
        {{ submissionMessage }}
      </p>

      <form @submit.prevent="addNewEvent">
        <div class="field">
          <label class="label" for="type">Event Type</label>
          <div class="control">
            <input
              id="type"
              class="input"
              v-model="eventData.type"
              type="text"
              placeholder="Event Type (e.g., Match, Tournament)"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="date">Date</label>
          <div class="control">
            <input
              id="date"
              class="input"
              v-model="eventData.date"
              type="date"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="time">Time</label>
          <div class="control">
            <input
              id="time"
              class="input"
              v-model="eventData.time"
              type="time"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="location">Event Location</label>
          <div class="control">
            <input
              id="location"
              class="input"
              v-model="eventData.location"
              type="text"
              placeholder="e.g., 123 Main St, New York, NY"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="homeTeam">Home Team</label>
          <div class="control">
            <input
              id="homeTeam"
              class="input"
              v-model="eventData.homeTeam"
              type="text"
              placeholder="Home Team"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="awayTeam">Away Team</label>
          <div class="control">
            <input
              id="awayTeam"
              class="input"
              v-model="eventData.awayTeam"
              type="text"
              placeholder="Away Team"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="league">League</label>
          <div class="control">
            <input
              id="league"
              class="input"
              v-model="eventData.league"
              type="text"
              placeholder="League"
              required
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-custom-blue has-text-black" type="submit">
              Add Event
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const eventData = ref({
  type: '',
  date: '',
  time: '',
  location: '',
  homeTeam: '',
  awayTeam: '',
  league: ''
});

const submissionMessage = ref('');


const addNewEvent = async () => {
  try {
    const adjustedEventData = {
      ...eventData.value,
      date: toLocalISODate(eventData.value.date),
    };

    await axios.post('https://sports-league-yepn.onrender.com/api/new-event', adjustedEventData);
    submissionMessage.value = 'Event added successfully!';
    eventData.value = {
      type: '',
      date: '',
      time: '',
      location: '',
      homeTeam: '',
      awayTeam: '',
      league: ''
    };
  } catch (err) {
    submissionMessage.value = 'Failed to add event.';
    console.error('Error adding event:', err);
  }
};

const toLocalISODate = (dateStr) => {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + offset);
  return date.toISOString().split('T')[0]; // only the date part
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
