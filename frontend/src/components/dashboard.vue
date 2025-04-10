<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-3">Dashboard</h2>
      <p>{{ secureMessage }}</p>
      <p v-if="userId">User ID: {{ userId }}</p>
      <button class="button is-danger my-4" @click="logout">Logout</button>

      <h3 class="title is-4 mt-5">Your Events</h3>

      <div class="columns">
        <div class="column is-one-third">
          <nav class="panel">
            <p class="panel-heading is-custom-blue">Filter and Search</p>

            <div class="panel-block">
              <p class="control has-icons-right">
                <input class="input" type="text" v-model="searchQuery" placeholder="Search in all fields" />
                <span class="icon is-left">
                  <i class="fas fa-search" aria-hidden="true"></i>
                </span>
              </p>
            </div>

            <div class="panel-block">
              <div class="select is-fullwidth">
                <select v-model="leagueFilter" @change="filterByLeague">
                  <option value="">All Leagues</option>
                  <option v-for="league in leagues" :key="league._id" :value="league.name">
                    {{ league.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="panel-block">
              <div class="select is-fullwidth">
                <select v-model="teamFilter" @change="filterByTeam">
                  <option value="">All Teams</option>
                  <option v-for="team in filteredTeams" :key="team" :value="team">
                    {{ team }}
                  </option>
                </select>
              </div>
            </div>

            <div class="panel-block buttons are-small is-flex-wrap-wrap">
              <button class="button is-custom-blue" @click="filterToday">Today</button>
              <button class="button is-custom-blue" @click="filterThisWeek">This Week</button>
              <button class="button is-custom-blue" @click="filterThisMonth">This Month</button>
              <button class="button is-light" @click="clearDateFilters">Clear Date Filters</button>
            </div>

            <!-- Custom Date Range -->
            <div class="panel-block">
              <input class="input mr-2" type="date" v-model="customStartDate" />
              <input class="input" type="date" v-model="customEndDate" @change="filterByCustomDateRange" />
            </div>

            <!-- <div class="panel-block">
              <button class="button is-link is-outlined is-fullwidth" @click="resetFilters">
                Reset all filters
              </button>
            </div> -->
          </nav>
        </div>

        <div class="column is-two-thirds">
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
const customStartDate = ref('');
const customEndDate = ref('');


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
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await axios.get('https://sports-league-yepn.onrender.com/api/dashboard-data', {
      headers: headers,
    });

    secureMessage.value = response.data.message;
    userId.value = response.data.userId;

    const resEvents = await axios.get('https://sports-league-yepn.onrender.com/api/all-events');
    events.value = resEvents.data;
    filteredEvents.value = resEvents.data;

    const resLeagues = await axios.get('https://sports-league-yepn.onrender.com/api/all-leagues');
    leagues.value = resLeagues.data;

    const resTeams = await axios.get('https://sports-league-yepn.onrender.com/api/teams');
    filteredTeams.value = resTeams.data;
  } catch (err) {
    console.error('Failed to fetch data:', err);
    alert('Session expired or data fetch failed.');
    logout(); // Redirect to logout in case of error
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

const filterToday = () => {
  const today = new Date().toISOString().split('T')[0];
  filteredEvents.value = events.value.filter(event => event.date === today);
};

const filterThisWeek = () => {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(now.getDate() + 7);
  filteredEvents.value = events.value.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= weekFromNow;
  });
};

const filterThisMonth = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  filteredEvents.value = events.value.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfMonth && eventDate <= endOfMonth;
  });
};

const filterByCustomDateRange = () => {
  if (!customStartDate.value || !customEndDate.value) return;

  const start = new Date(customStartDate.value);
  const end = new Date(customEndDate.value);
  filteredEvents.value = events.value.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= start && eventDate <= end;
  });
};

const clearDateFilters = () => {
  customStartDate.value = '';
  customEndDate.value = '';
  filteredEvents.value = events.value;
};

</script>

<style scoped>
.navbar.is-custom-blue {
  background-color: #1FE8F7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.panel-heading.is-custom-blue {
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
}

.button.is-custom-blue {
  background-color: #1FE8F7;
  color: #2e333c;
  border: none;
}

.button.is-custom-blue:hover {
  background-color: #1ed0dd;
  color: #ffffff;
}
</style>
