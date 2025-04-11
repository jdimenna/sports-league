<template>
    <div class="container my-6">
      <h2 class="title is-3">Your Events</h2>
  
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event._id">
            <td class="has-text-weight-bold">{{ event.type }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ formatTime(event.date, event.time) }}</td>
            <td @click="openMap(event.location)" class="location-field">
              {{ event.location }}
            </td>
            <td>{{ event.homeTeam }}</td>
            <td>{{ event.awayTeam || '-' }}</td>
            <td>{{ event.league?.name || 'N/A' }}</td>
            <td>
              <button class="delete-button" @click="openDeleteModal(event._id)">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Google Map Modal -->
      <div v-if="showMap" class="modal is-active">
        <div class="modal-background" @click="closeMap"></div>
        <div class="modal-content">
          <div id="map"></div>
        </div>
        <button class="modal-close is-large" @click="closeMap"></button>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirm Deletion</p>
            <button class="delete" aria-label="close" @click="closeDeleteModal"></button>
          </header>
          <section class="modal-card-body">
            Are you sure you want to delete this event?
          </section>
          <footer class="modal-card-foot">
            <button class="button is-danger" @click="confirmDelete">Delete</button>
            <button class="button" @click="closeDeleteModal">Cancel</button>
          </footer>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import axios from 'axios'
  
  const events = ref([])
  const filteredEvents = ref([])
  const sortOrder = ref({ date: null, time: null })
  
  const showMap = ref(false)
  const map = ref(null)
  const selectedLocation = ref('')
  
  const showDeleteModal = ref(false)
  const eventToDelete = ref(null)
  
  const openMap = async (location) => {
    selectedLocation.value = location
    showMap.value = true
  
    await nextTick()
  
    const geocoder = new window.google.maps.Geocoder()
  
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK') {
        const mapOptions = {
          center: results[0].geometry.location,
          zoom: 15,
        }
  
        map.value = new window.google.maps.Map(document.getElementById('map'), mapOptions)
  
        new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map.value,
        })
      } else {
        alert('Geocode failed: ' + status)
      }
    })
  }
  
  const closeMap = () => {
    showMap.value = false
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }
  
  const formatTime = (dateString, timeString) => {
    const dateTime = new Date(`${dateString}T${timeString}:00`)
    return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  const sortTable = (column) => {
    const current = sortOrder.value[column]
    const next = current === 'asc' ? 'desc' : 'asc'
    sortOrder.value[column] = next
  
    filteredEvents.value.sort((a, b) => {
      const aVal = column === 'date' ? new Date(a.date) : new Date(`${a.date}T${a.time}:00`)
      const bVal = column === 'date' ? new Date(b.date) : new Date(`${b.date}T${b.time}:00`)
      return next === 'asc' ? aVal - bVal : bVal - aVal
    })
  }
  
  // Modal delete functions
  const openDeleteModal = (eventId) => {
    eventToDelete.value = eventId
    showDeleteModal.value = true
  }
  
  const closeDeleteModal = () => {
    eventToDelete.value = null
    showDeleteModal.value = false
  }
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`https://sports-league-yepn.onrender.com/api/delete-event/${eventToDelete.value}`)
      filteredEvents.value = filteredEvents.value.filter(e => e._id !== eventToDelete.value)
      events.value = events.value.filter(e => e._id !== eventToDelete.value)
      closeDeleteModal()
    } catch (err) {
      console.error('Error deleting event:', err)
      alert('Failed to delete event.')
      closeDeleteModal()
    }
  }
  
  onMounted(async () => {
    try {
      const res = await axios.get('https://sports-league-yepn.onrender.com/api/all-events')
      events.value = res.data
      filteredEvents.value = res.data
    } catch (err) {
      console.error('Error fetching events:', err)
      alert('Failed to load events.')
    }
  })
  </script>
  
  <style scoped>
  .location-field {
    cursor: pointer;
    color: #3273dc;
  }
  .location-field:hover {
    text-decoration: underline;
  }
  
  .delete-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
  }
  .delete-button:hover {
    color: red;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px;
  }
  
  #map {
    width: 100%;
    height: 400px;
    border-radius: 8px;
  }
  </style>
  