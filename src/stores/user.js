import { defineStore } from 'pinia';
import api from '@/api';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    info: null
  }),
  actions: {
    async fetchUserInfo() {
      this.loading = true;
      try {
        const response = await api.get('/user');
        this.info = response.data.data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    setUserInfo(userInfo) {
        this.info = userInfo;
      }
  }
});
