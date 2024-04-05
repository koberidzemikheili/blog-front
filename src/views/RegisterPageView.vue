<template>
  <div class="flex items-center justify-center h-screen">
    <form @submit.prevent="submitForm" class="p-16 dark:bg-slate-700 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-300">Register</h2>

      <div class="mb-4">
        <label for="name" class="block mb-2 text-gray-300">Name:</label>
        <input type="text" id="name" v-model="name" v-bind="nameAttrs"  
               class="w-full px-3 py-2 border rounded" :class="{'border-red-500': errors.name}">
        <div class="text-red-500" v-if="errors.name">{{ errors.name }}</div>      
      </div>

      <div class="mb-4">
        <label for="lastname" class="block mb-2 text-gray-300">Last Name:</label>
        <input type="text" id="lastname" v-model="lastname" v-bind="lastnameAttrs"  
               class="w-full px-3 py-2 border rounded" :class="{'border-red-500': errors.lastname}">
        <div class="text-red-500" v-if="errors.lastname">{{ errors.lastname }}</div>
      </div>

      <div class="mb-4">
        <label for="email" class="block mb-2 text-gray-300">Email:</label>
        <input type="email" id="email" v-model="email" v-bind="emailAttrs"  
               class="w-full px-3 py-2 border rounded" :class="{'border-red-500': errors.email}">
        <div class="text-red-500" v-if="errors.email">{{ errors.email }}</div>
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2 text-gray-300">Password:</label>
        <input type="password" id="password" v-model="password" v-bind="passwordAttrs"  
               class="w-full px-3 py-2 border rounded" :class="{'border-red-500': errors.password}">
        <div class="text-red-500" v-if="errors.password">{{ errors.password }}</div>
        <div class="text-red-500" v-if="backenderrors">
  <p v-for="(messages, field) in backenderrors" :key="field">
    {{ field }}: 
    <span v-for="(message, index) in messages" :key="index">
      {{ message }} 
    </span>
  </p>
</div>

      </div>

      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Register</button>
    </form>
  </div>
</template>
<script setup>
import { onBeforeMount,ref } from 'vue';
import api from '@/api';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();

const schema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 2 characters'),
  lastname: yup.string().required('Last name is required').min(3, 'Last name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format').min(6, 'email must be at least 8 characters')
                             .max(32, 'email cannot exceed 32 characters'),
  password: yup.string().required('Password is required')
                             .min(6, 'Password must be at least 6 characters')
                             .max(32, 'Password cannot exceed 32 characters')
})

const { handleSubmit, errors, defineField } = useForm({ validationSchema: schema });

const [name, nameAttrs] = defineField('name');
const [lastname, lastnameAttrs] = defineField('lastname');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const backenderrors = ref();

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

const submitForm = handleSubmit(async (values) => {
  try {
    await api.post('/register', {
      first_name: values.name,
      last_name: values.lastname,
      email: values.email,
      password: values.password
    });
    router.push('/login');
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400 || err.response.status === 422) { 
        backenderrors.value = err.response.data.errors;
      } else {
        console.log('Error:', err.response);
      }
    } else {
      console.log('Network Error:', err);
    }
  }
});
</script>
