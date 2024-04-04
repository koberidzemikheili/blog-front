<template>
  <div class="h-screen flex justify-center">
    <div v-if="!loading">Loading...</div>
    <div v-else class="w-full max-w-2xl">
      <Post v-for="post in postInfo" :key="post.id" :post="post" @post-deleted="deletePost" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import Post from '@/components/PostComponent.vue';

const postInfo = ref([]);
const loading = ref(false);

onMounted( async () => {
  try{
    const response = await api.get('/posts');
    if(response.status === 200){
      postInfo.value = response.data.data;
      loading.value = true;
    }
  }
  catch(err){
    console.log(err);
  }
});

const deletePost = (postId) => {
  postInfo.value = postInfo.value.filter(post => post.id !== postId);
};
</script>
