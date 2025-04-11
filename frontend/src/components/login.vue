<template>
  <div class="hero is-halfheight is-flex is-align-items-center is-justify-content-center">
    <div class="level-item">
      <div>
        <form @submit.prevent="login" class="box">
          <h1 class="title is-2 has-text-centered mb-5">Log In</h1> 

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
              <button class="button is-custom-blue has-text-black" @click="navigateToDash">Continue As Guest</button>
            </div>
          </div>
        </form>
      </div>
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
      const response = await axios.post('https://sports-league-yepn.onrender.com/api/login', {
        username: username.value,
        password: password.value
      });
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      alert('Invalid login');
    }
  };

  const navigateToDash = () => {
    router.push('/dashboard');
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

.button{
    margin-right: 10px;
  }

</style>
