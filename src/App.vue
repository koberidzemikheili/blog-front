<template>
  <div id="app" class="dark:bg-slate-800">
    <header class="p-4 dark:bg-blue-500 text-white flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold">Blog</router-link>
      <div v-if="userStore.info">
        <span class="mr-4">Hi, {{ userStore.info.first_name }}! </span>
        <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <div v-else>
        <button @click="redirectLogin" class="bg-green-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import api from '@/api';


const userStore = useUserStore();
const router = useRouter();


onMounted(() => {
  userStore.fetchUserInfo();
});

const logout = async () => {
  try {
    const response = await api.post('/logout');
    if(response.status === 200) {
      localStorage.setItem('token', null);
      userStore.info = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const redirectLogin = () => {
  router.push('/login');
};
</script>
