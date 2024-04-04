<template>
  <div class="post bg-slate-700 rounded shadow mb-4 p-4">
    <div class="flex justify-between items-center mb-2">
      <div>
        <p class="text-sm font-semibold text-gray-200">{{ post.full_name}}</p>
        <p class="text-xs text-gray-300">{{ post.publish_date }}</p>
      </div>
      <button class="text-sm font-semibold text-gray-200 hover:text-gray-500"
      v-if="(userStore.info && post.user_id === userStore.info.id) 
          || (userStore.info && userStore.info.role === 'Admin')" @click="deletePost(post.id)"
          >Delete</button>
    </div>
    <h2 class="text-xl font-bold mb-2 text-gray-200">{{ post.title }}</h2>
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
        <input type="text" v-model="newComment" class="border p-2 w-full rounded" placeholder="Write a comment..." @keyup.enter="postComment" />
        <button @click="postComment" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Post Comment</button>
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
import { ref, reactive } from 'vue';
import api from '@/api';
import { defineProps,defineEmits } from 'vue';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();
const props = defineProps(['post']);
const newComment = ref('');
const post = reactive({ ...props.post });
const emit = defineEmits(['post-deleted']);

const postComment = async () => {
  if (newComment.value.trim() !== '') {
    try {
      const response = await api.post('/comments', {
        post_id: post.id,
        body: newComment.value
      });
      if (response.status === 201) {
        post.comments.push(response.data.comment);
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
      post.comments = post.comments.filter(comment => comment.id !== commentId);
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
</script>
