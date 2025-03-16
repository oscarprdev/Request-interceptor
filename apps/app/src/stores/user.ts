import { defineStore } from 'pinia';

interface UserStore {
  userToken: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    userToken: null,
  }),
  actions: {
    setUserToken(userToken: string) {
      this.userToken = userToken;
    },
  },
});
