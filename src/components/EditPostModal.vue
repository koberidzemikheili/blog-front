<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-slate-700 p-8 rounded-lg shadow-md w-96">
        <h2 class="text-xl font-semibold mb-4 text-gray-300">Edit Post</h2>
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <label for="title" class="block text-gray-300">Title:</label>
            <input type="text" id="title" v-model="title" v-bind="titleAttrs" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <div class="text-red-500">{{ errors.title }}</div>
          </div>
          <div class="mb-4">
            <label for="body" class="block text-gray-300">Body:</label>
            <textarea id="body" v-model="body" v-bind="bodyAttrs" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="4"></textarea>
            <div class="text-red-500">{{ errors.body }}</div>
          </div>
          <div class="mb-4">
            <label for="publish_date" class="block text-gray-300">Publish Date:</label>
            <input type="date" id="publish_date" v-model="publishDate" v-bind="publishDateAttrs" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <div class="text-red-500">{{ errors.publish_date }}</div>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Update Post</button>
            <button type="button" @click="closeModal" class="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import api from '@/api';
  import { defineProps, defineEmits } from 'vue';
  import { useForm } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/yup'; 
  import * as yup from 'yup';
  
  const props = defineProps({
    post: Object,
  });
  
  const emit = defineEmits(['close', 'post-edited']);
  
  const { errors, handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(
      yup.object({
        title: yup.string().min(3).required(),
        body: yup.string().min(6).required(),
        publish_date: yup.date().required(),
       }),
    ),
    initialValues: { title: props.post.title, body: props.post.body, publish_date: props.post.publish_date },
  });
  
  const [title, titleAttrs] = defineField('title');
  const [body, bodyAttrs] = defineField('body');
  const [publishDate, publishDateAttrs] = defineField('publish_date');
  
  onMounted(() => {
    publishDate.value = props.post.publish_date;
  });
  
  const onSubmit = handleSubmit(async (values) => {
    try {
        const year = values.publish_date.getFullYear();
    const month = (values.publish_date.getMonth() + 1).toString().padStart(2, '0');
    const day = values.publish_date.getDate().toString().padStart(2, '0'); 
    values.publish_date = `${year}-${month}-${day}`;

      const response = await api.put(`/posts/${props.post.id}`, values);
      if (response.status === 200) {
        emit('post-edited', response.data.post);
        emit('close');
      }
    } catch (error) {
      console.error(error);
    }
  });
  
  const closeModal = () => {
    emit('close');
  };
</script>
  