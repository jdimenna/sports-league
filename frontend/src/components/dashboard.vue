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
              <tr
                v-for="event in filteredEvents"
                :key="event._id"
                style="cursor: pointer"
              >
                <td class="has-text-weight-bold">{{ event.type }}</td>
                <td>{{ formatDate(event.date) }}</td>
                <td>{{ formatTime(event.date, event.time) }}</td>
                <td>
                  <span 
                    class="location-field"
                    @click="openMap(event.location)"
                  >
                    {{ event.location }}
                  </span>
                </td>
                <td>{{ event.homeTeam }}</td>
                <td>{{ event.awayTeam || '-'}}</td>
                <td>{{ event.league?.name || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="showMap" class="modal is-active">
          <div class="modal-background" @click="closeMap"></div>
          <div class="modal-content">
            <div id="map" style="width: 100%; height: 400px;"></div>
          </div>
          <button class="modal-close is-large" aria-label="close" @click="closeMap"></button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
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
const showMap = ref(false);
const map = ref(null);
const selectedLocation = ref('');
const hoverLocation = ref(false); // Track hover state for location field

const openMap = async (location) => {
  selectedLocation.value = location;
  showMap.value = true;

  await nextTick(); // Wait until modal and DOM are rendered

  const geocoder = new window.google.maps.Geocoder();

  geocoder.geocode({ address: location }, (results, status) => {
    if (status === 'OK') {
      const mapOptions = {
        center: results[0].geometry.location,
        zoom: 15,
      };

      map.value = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      new window.google.maps.Marker({
        position: results[0].geometry.location,
        map: map.value,
      });
    } else {
      alert('Geocode failed: ' + status);
    }
  });
};

const closeMap = () => {
  showMap.value = false;
};

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
  try {
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

.location-field {
  cursor: pointer;
  transition: text-decoration 0.2s ease, color 0.2s ease;
}

.location-field:hover {
  text-decoration: underline;
  color: blue;
}

/* Enhancing modal appearance */
.modal-content {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
  max-width: 80%;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-in-out;
}

/* Adding smooth fade-in effect */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal background style */
.modal-background {
  background-color: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease-in-out;
}

/* Close button styling */
.modal-close {
  background-color: #1b1e24;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #333;
  transition: background-color 0.3s ease;
}

.modal-close:hover {
  background-color: #ff3860;
  color: #fff;
}

/* Map container styling */
#map {
  border-radius: 8px;
  height: 400px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Modal content */
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

/* Enhance modal background for smoother transition */
.modal-background.is-active {
  opacity: 1;
}

/* Overlay for better focus */
.modal-content .modal-close {
  z-index: 2;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>


