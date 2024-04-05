<template>
  <div class="post bg-slate-700 rounded shadow mb-4 p-4">
    <div class="flex justify-between items-center mb-2">
      <div>
        <p class="text-sm font-semibold text-gray-200">{{ post.full_name}}</p>
        <div class="flex flex-row">
        <p class="text-xs text-gray-300 mr-2">{{ post.publish_date }}</p>
        <p class="text-xs text-gray-300">Views:{{ post.views }}</p>
      </div>
      </div>
      <div>
        <EditPostModal v-if="isModalOpen" :post="postToEdit" @close="closeModal" @post-edited="updatePost" />
          <div>
            <button class="text-sm font-semibold text-gray-200 hover:text-gray-500 mr-3"
      v-if="(userStore.info && post.user_id === userStore.info.id) 
          || (userStore.info && userStore.info.role === 'Admin')" @click="deletePost(post.id)"
          >Delete</button>
   <button class="text-sm font-semibold text-blue-500 hover:text-blue-600"
     v-if="(userStore.info && post.user_id === userStore.info.id) 
         || (userStore.info && userStore.info.role === 'Admin')" @click="openModal(post)"
       >Edit</button>
 </div>
        </div>
    </div>
    <h2 class="text-xl font-bold mb-2 text-gray-200 cursor-pointer" @click="redirectToDetail(post.id)">{{ post.title }}</h2>
    <p class="text-gray-200 mb-4">{{ post.body }}</p>
    <hr class="my-4"/>
    <div class="comments">
      <div v-for="comment in post.comments" :key="comment.id" class="comment mb-2 p-2 bg-slate-500 rounded">
        <div class="flex flex-row justify-between">
          <p class="text-xs text-gray-200">{{ comment.full_name }} - {{ comment.created_at }}</p>
          <button v-if="(userStore.info && comment.user_id === userStore.info.id) 
          || (userStore.info && userStore.info.role === 'Admin')" @click="deleteComment(comment.id)"
           class="text-xs text-white hover:text-gray-600">Delete</button>
        </div>
        <p class="text-sm text-gray-200">{{ comment.body }}</p>
      </div>
      <div class="mt-4">
        <input type="text" :disabled="!userStore.info" v-model="newComment" class="border p-2 w-full rounded" placeholder="Write a comment..." @keyup.enter="postComment" />
        <button @click="postComment" :disabled="!userStore.info" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Post Comment</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post {
  border: 1px solid #e5e7eb;
}
</style>

<script setup>
import { ref } from 'vue';
import api from '@/api';
import { defineProps,defineEmits } from 'vue';
import { useUserStore } from '@/stores/user.js';
import router from '@/router';
import EditPostModal from '@/components/EditPostModal.vue';

const userStore = useUserStore();
const props = defineProps(['post']);
const newComment = ref('');
const post = ref({ ...props.post });
const emit = defineEmits(['post-deleted','post-edited']);


const isModalOpen = ref(false);
const postToEdit = ref();

const openModal = (post) => {
  isModalOpen.value = true;
  postToEdit.value = post;
};

const closeModal = () => {
  isModalOpen.value = false;
  postToEdit.value = null;
};

const postComment = async () => {
  if (newComment.value.trim() !== '') {
    try {
      const response = await api.post('/comments', {
        post_id: post.value.id,
        body: newComment.value
      });
      if (response.status === 201) {
        post.value.comments.push(response.data.comment);
        newComment.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  }
}
const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    if (response.status === 200) {
      post.value.comments = post.value.comments.filter(comment => comment.id !== commentId);
    }
  } catch (err) {
    console.error(err);
  }
}
const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    if (response.status === 200) {
      emit('post-deleted', postId);
    }
  } catch (err) {
    console.error(err);
  }
}
const updatePost = () => {
  emit('post-edited');
}

const redirectToDetail = (postId) => {
  router.push(`/posts/${postId}`)
}

</script>