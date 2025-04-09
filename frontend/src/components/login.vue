<template>
  <div class="hero is-halfheight is-flex is-align-items-center is-justify-content-center">
    <div class="level-item">
      <form @submit.prevent="login" class="box">

        <div class="field">
          <label class="label" for="username">Username</label>
          <div class="control">
            <input
              id="username"
              class="input"
              v-model="username"
              type="text"
              placeholder="Username"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="password">Password</label>
          <div class="control">
            <input
              id="password"
              class="input"
              v-model="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-custom-blue has-text-black" type="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = async () => {
    try {
      const response = await axios.post('/api/login', {
        username: username.value,
        password: password.value
      });
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      alert('Invalid login');
    }
  };
  </script>

<style scoped>
.box {
  width: 400px; 
}


.button.is-custom-blue {
  background-color: #1FE8F7;
  color: white;
  border-color: #1FE8F7;
}

.button.is-custom-blue:hover {
  background-color: #17c7d6; /* Slightly darker blue on hover */
  border-color: #17c7d6;
}


</style>
