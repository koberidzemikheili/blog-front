<template>
    <div class="flex items-center justify-center h-screen">
      <form @submit.prevent="submitForm" class="p-16 dark:bg-slate-700 rounded shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-300">Login</h2>
  
        <div class="mb-4">
          <label for="email" class="block mb-2 text-gray-300">Email:</label>
          <input type="email" id="email" v-model="email" class="w-full px-3 py-2 border rounded">
          <p class="text-red-500" v-if="error.email">{{ error.email }}</p>
        </div>
  
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-300">Password:</label>
          <input type="password" id="password" v-model="password" class="w-full px-3 py-2 border rounded">
          <p class="text-red-500" v-if="error.password">{{ error.password }}</p>
          <p class="text-red-500" v-if="error.message">{{ error.message }}</p>
        </div>
        <div>
        <div class="flex justify-between text-gray-300 flex-row mb-4">
          <div class="text-gray-300">
          <input type="checkbox" id="remember" v-model="remember">
          <label for="remember"> Remember me</label>
          </div>
        <div @click="redirectRegister" class="text-gray-300">Register</div>
      </div>
      </div>
        <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive,onBeforeMount } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore();
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const remember = ref(false);
  const error = reactive({});
  
  onBeforeMount(() => {
  if (!userStore.loading && userStore.info) {
    router.push('/posts');
  }
});

  const submitForm = async () => {
    try {
     const response =  await axios.post('http://127.0.0.1:8000/api/login', {
        email: email.value,
        password: password.value,
        remember: remember.value
      });
      if(response.status===201){
        localStorage.setItem('token', response.data.token.plainTextToken);
      router.push('/posts');
      userStore.setUserInfo(response.data.user);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        error.email = err?.response?.data?.errors?.email[0];
        error.password = err?.response?.data?.errors?.password[0];
        error.message = err?.response?.data?.message;
      }
    }
  };

  const redirectRegister = () =>{
    router.push('/register');
  }
  </script>