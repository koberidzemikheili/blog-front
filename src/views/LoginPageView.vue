<template>
  <div class="flex items-center justify-center h-screen">
    <form @submit.prevent="submitForm" class="p-16 dark:bg-slate-700 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-300">Login</h2>

      <div class="mb-4">
        <label for="email" class="block mb-2 text-gray-300">Email:</label>
        <input type="email" id="email" v-model="email" v-bind="emailAttrs" 
               class="w-full px-3 py-2 border rounded" :class="{'border-red-500': errors.email}" />
        <div class="text-red-500" v-if="errors.email">{{ errors.email }}</div>
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-2 text-gray-300">Password:</label>
        <input type="password" id="password" v-model="password" v-bind="passwordAttrs" 
               class="w-full px-3 py-2 border rounded" :class="{'border-red-500': errors.password}" />
        <div class="text-red-500" v-if="errors.password">{{ errors.password }}</div>
        <div class="text-red-500" v-if="backerrors">{{ backerrors }}</div>

      </div>

      <div class="flex justify-between text-gray-300 flex-row mb-4">
        <div class="text-gray-300">
          <input type="checkbox" id="remember" v-model="remember">
          <label for="remember"> Remember me</label>
        </div>
        <div @click="redirectRegister" class="text-gray-300">Register</div>
      </div>

      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">Login</button>
    </form>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import api from '@/api';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useForm} from 'vee-validate';
import * as yup from 'yup'; 

const userStore = useUserStore();
const router = useRouter();

const schema = yup.object({
  email: yup.string()
            .required('Email is required')
            .email('Invalid email format')
            .min(8, 'Email must be at least 8 characters')
            .max(32, 'Email cannot exceed 32 characters'),
  password: yup.string()
               .required('Password is required')
               .min(6, 'Password must be at least 6 characters')
               .max(32, 'Password cannot exceed 32 characters')
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const remember = ref(false);
const backerrors = ref();


const submitForm = handleSubmit(async (values) => {
  try {
    const response =  await api.post('/login', {
        email: values.email,
        password: values.password,
        remember: remember.value
    });

    if(response.status === 201){
      localStorage.setItem('token', response.data.token.plainTextToken);
      router.push('/posts');
      userStore.setUserInfo(response.data.user);
    }

  } catch (err) {
    if (err.response) {
      if (err.response.status === 400 || err.response.status === 422) {
        const validationErrors = err.response.data.errors;

        errors.value = {};  

        Object.entries(validationErrors).forEach(([field, messages]) => {
          errors.value[field] = messages[0];
        });
      } else if (err.response.status === 401) {
        backerrors.value = "Invalid email or password";
      }  else {
        backerrors.value = "An error occurred. Please try again later.";
      }
    } else {
      backerrors.value = "An error occurred. Please try again later.";
    }
  }
});

const redirectRegister = () =>{
  router.push('/register');
} 
</script>