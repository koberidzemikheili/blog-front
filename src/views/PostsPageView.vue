<template>
  <div>
    <button v-if="userStore.info && (userStore.info.role === 'Admin' || userStore.info.role === 'Editor')" 
        @click="isModalOpen = true" 
        class="text-gray-200 flex flex-col justify-center border border-gray-200 bg-indigo-500 px-4 mt-2 ml-2 rounded hover:bg-indigo-700">
      Add Post
    </button>
    <AddPostModal v-if="isModalOpen" @close="isModalOpen = false" @add-post="addPost"/>

    <div class="min-h-screen flex justify-center">
      <div v-if="!loading">Loading...</div>
      <div v-if="postInfo.length === 0">NO POSTS YET</div>

      <div v-else class="w-full max-w-2xl mt-6">
        <Post v-for="post in postInfo" :key="post.id" :post="post" @post-deleted="deletePost" @post-edited="fetchPost"/>

        <div class="flex justify-center mt-4"> <button v-if="currentPage > 1" 
                  @click="fetchPosts(currentPage - 1)" 
                  class="bg-gray-400 px-3 py-2 rounded-l">Previous</button>
          <button v-if="currentPage < lastPage"
                  @click="fetchPosts(currentPage + 1)"
                  class="bg-gray-400 px-3 py-2 rounded-r">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import Post from '@/components/PostComponent.vue';
import AddPostModal from '@/components/AddPostModal.vue';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();
const isModalOpen = ref(false);
const postInfo = ref([]);
const loading = ref(false);
const currentPage = ref(1); 
  const lastPage = ref(1);

onMounted(async () => {
    await fetchPosts(); 
  });

  const fetchPosts = async (page = 1) => {
    try {
      const response = await api.get(`/posts?page=${page}`);
      if (response.status === 200) {
        postInfo.value = response.data.data;
        currentPage.value = response.data.meta.current_page;
        lastPage.value = response.data.meta.last_page;
        loading.value = true;
      }
    } catch (err) {
      console.log(err);
    }
  };

const fetchPost =  () => {
      location.reload();
};

const deletePost = (postId) => {
  postInfo.value = postInfo.value.filter(post => post.id !== postId);
};

const addPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    if (response.status === 201) {
      postInfo.value.push(response.data.post);
      isModalOpen.value = false;
    }
  } catch (err) {
    console.log(err);
  }
};
</script>