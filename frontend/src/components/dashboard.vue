<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-3">Dashboard</h2>
      <p>{{ secureMessage }}</p>
      <p v-if="userId">User ID: {{ userId }}</p>
      <button class="button is-danger my-4" @click="logout">Logout</button>

      <h3 class="title is-4 mt-5">Your Events</h3>
      <h4 class="title is-5">Filter League/Team</h4>

      <div class="select is-fullwidth mb-4">
        <select v-model="leagueFilter" @change="filterByLeague">
          <option value="">All Leagues</option>
          <option v-for="league in leagues" :key="league._id" :value="league.name">
            {{ league.name }}
          </option>
        </select>
      </div>

      <div class="select is-fullwidth mb-4">
        <select v-model="teamFilter" @change="filterByTeam">
          <option value="">All Teams</option>
          <option v-for="team in filteredTeams" :key="team" :value="team">
            {{ team }}
          </option>
        </select>
      </div>

      <div class="field">
        <label class="label" for="search">Search</label>
        <div class="control">
          <input
            id="search"
            class="input"
            v-model="searchQuery"
            type="text"
            placeholder="Search in all fields"
          />
        </div>
      </div>

      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>Event Name</th>
            <th @click="sortTable('date')">Date</th>
            <th @click="sortTable('time')">Time</th>
            <th>Location</th>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>League</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event._id">
            <td class="has-text-weight-bold">{{ event.type }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ formatTime(event.date, event.time) }}</td>
            <td>{{ event.location }}</td>
            <td>{{ event.homeTeam }}</td>
            <td>{{ event.awayTeam || '-'}}</td>
            <td>{{ event.league?.name || 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const secureMessage = ref('');
const userId = ref('');
const events = ref([]);
const leagues = ref([]);
const teams = ref([]);
const leagueFilter = ref('');
const filteredEvents = ref([]);
const teamFilter = ref('');
const filteredTeams = ref([]);
const sortOrder = ref({ date: null, time: null });
const searchQuery = ref('');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatTime = (dateString, timeString) => {
  const dateTimeString = `${dateString}T${timeString}:00`;
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  try {
    // const response = await axios.get('/api/dashboard-data', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // secureMessage.value = response.data.message;
    // userId.value = response.data.userId;

    const resEvents = await axios.get('https://sports-league-yepn.onrender.com/api/all-events');
    events.value = resEvents.data;
    filteredEvents.value = resEvents.data;

    const resLeagues = await axios.get('https://sports-league-yepn.onrender.com/api/all-leagues');
    leagues.value = resLeagues.data;

    const resTeams = await axios.get('https://sports-league-yepn.onrender.com/api/teams');
    filteredTeams.value = resTeams.data;

  } catch (err) {
    console.error('Failed to fetch data:', err);
    alert('Session expired or data get failed.');
    logout();
  }
});

watch(leagueFilter, () => {
  filterByLeague();
});

const filterByLeague = () => {
  if (leagueFilter.value) {
    filteredEvents.value = events.value.filter(event => event.league?.name === leagueFilter.value);
  } else {
    filteredEvents.value = events.value;
  }
};

const filterByTeam = () => {
  if (teamFilter.value) {
    filteredEvents.value = events.value.filter(event =>
      event.homeTeam === teamFilter.value || event.awayTeam === teamFilter.value
    );
  } else {
    filteredEvents.value = events.value;
  }
};

const sortTable = (column) => {
  const currentSortOrder = sortOrder.value[column];
  const newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  sortOrder.value[column] = newSortOrder;

  filteredEvents.value.sort((a, b) => {
    const aValue = column === 'date' ? new Date(a.date) : new Date(`${a.date}T${a.time}:00`);
    const bValue = column === 'date' ? new Date(b.date) : new Date(`${b.date}T${b.time}:00`);

    if (newSortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
};

watch([leagueFilter, teamFilter, searchQuery], () => {
  filterByFilters();
});

const filterByFilters = () => {
  let filtered = events.value;

  if (leagueFilter.value) {
    filtered = filtered.filter(event => event.league?.name === leagueFilter.value);
  }

  if (teamFilter.value) {
    filtered = filtered.filter(event =>
      event.homeTeam === teamFilter.value || event.awayTeam === teamFilter.value
    );
  }

  if (searchQuery.value) {
    filtered = filtered.filter(event =>
      Object.values(event).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );
  }

  filteredEvents.value = filtered;
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
