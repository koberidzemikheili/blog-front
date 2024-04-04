<template>
  <div class="flex items-center justify-center h-screen">
    <form @submit.prevent="submitForm" class="p-16 dark:bg-slate-700 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-300">Register</h2>

      <div class="mb-4">
        <label for="name" class="block mb-2 text-gray-300">Name:</label>
        <input type="text" id="name" v-model="form.name"  class="w-full px-3 py-2 border rounded">
        <p class="text-red-500" v-for="(err, index) in error.name" :key="index">{{ err }}</p>      </div>

      <div class="mb-4">
        <label for="lastname" class="block mb-2 text-gray-300">Last Name:</label>
        <input type="text" id="lastname" v-model="form.lastname"  class="w-full px-3 py-2 border rounded">
        <p class="text-red-500" v-for="(err, index) in error.lastname" :key="index">{{ err }}</p>      </div>

      <div class="mb-4">
        <label for="email" class="block mb-2 text-gray-300">Email:</label>
        <input type="email" id="email" v-model="form.email"  class="w-full px-3 py-2 border rounded">
        <p class="text-red-500" v-for="(err, index) in error.email" :key="index">{{ err }}</p>      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2 text-gray-300">Password:</label>
        <input type="password" id="password" v-model="form.password"  class="w-full px-3 py-2 border rounded">
        <p class="text-red-500" v-for="(err, index) in error.password" :key="index">{{ err }}</p>      </div>

      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Register</button>
    </form>
  </div>
</template>

<script setup>
import { reactive,onBeforeMount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import api from '@/api';


const router = useRouter();
const form = reactive({
  name: '',
  lastname: '',
  email: '',
  password: ''
});
const error = reactive({
  name: [],
  lastname: [],
  email: [],
  password: []
});

onBeforeMount(async () => {
    try {
     const response =  await api.get('/user');
      if(response.status === 200){
        router.push('/posts');
      }
    } catch (err) {
      console.error(err);
    }
  });

const submitForm = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/register', {
      first_name: form.name,
      last_name: form.lastname,
      email: form.email,
      password: form.password
    });
    router.push('/login');
  }catch (err) {
  if (err.response && err.response.data) {
    error.name = err.response.data.errors.first_name || [];
    error.lastname = err.response.data.errors.last_name || [];
    error.email = err.response.data.errors.email || [];
    error.password = err.response.data.errors.password || [];
  }
}
};
</script>
