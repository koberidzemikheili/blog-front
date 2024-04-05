<template>
    <div class="h-screen flex justify-center">
      <h1 v-if="!loading" class="text-white text-xl">Page not Found.</h1>
      <div v-else class="w-full max-w-2xl">
        <Post :post="postInfo" @post-deleted="deletePost" @post-edited="fetchPost" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted,defineEmits } from 'vue';
  import { useRoute } from 'vue-router';
  import api from '@/api';
  import Post from '@/components/PostComponent.vue';
  
  const postInfo = ref([]);
  const loading = ref(false);

  const route = useRoute();
  const emit = defineEmits(['post-edited']);


  onMounted( async () => {
    const postId = route.params.id;
    try{
      const response = await api.get(`/posts/${postId}`);
      if(response.status === 200){
        postInfo.value = response.data.data;
        loading.value = true;
      }
    }
    catch(err){
        console.log(err?.response?.status);
    }
  });
  
  const deletePost = (postId) => {
    postInfo.value = postInfo.value.filter(post => post.id !== postId);
  };

  const fetchPost = () =>{
    emit('post-edited');
  }
  </script>