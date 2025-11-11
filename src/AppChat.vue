<script setup>
  import { onMounted, ref } from 'vue';
  import { useQuasar } from 'quasar';
  import { isAuth, ws, users, allMsg } from '@/store/chat.js';
  import TheChatToolbar from './components/TheChatToolbar.vue';
  import TheLoginPage from './components/TheLoginPage.vue';
  import TheChatForm from './components/TheChatForm.vue';
  import TheChatMessagesList from './components/TheChatMessagesList.vue';
  import TheChatUsersList from './components/TheChatUsersList.vue';
  import { connectToChat } from '@/store/chat.js';

  const $q = useQuasar();

  ws.on('close', () => {
    if (isAuth.value) {
      $q.notify({
        type: 'negative',
        message: 'Connection to server lost !',
        timeout: 2000,
        position: 'top',
      });
    }
    isAuth.value = false;
    users.value = [];
    allMsg.value = [];
  });

  const tryingAutoLogin = ref(true);
  connectToChat()
    .catch(() => {}) // silently fail if no valid JWT
    .finally(() => tryingAutoLogin.value = false);
</script>

<template>
  <q-layout view="hHh lpr lFf">

    <q-header :class="{ 'no-shadow': $q.dark.isActive }" :elevated="!$q.dark.isActive">
      <TheChatToolbar />
    </q-header>

    <TheChatUsersList />

    <q-page-container>
      <q-page v-if="!tryingAutoLogin" padding :class="{ 'no-scroll': !isAuth }">
        <TheLoginPage v-if="!isAuth" />
        <TheChatMessagesList v-if="isAuth" />
      </q-page>
      <q-page v-if="tryingAutoLogin" class="flex flex-center">
        <q-spinner size="50px" color="primary" />
      </q-page>
    </q-page-container>

    <q-footer v-if="isAuth" class="q-pa-xs" :class="{ 'bg-dark': $q.dark.isActive, 'bg-grey-2': !$q.dark.isActive }">
      <TheChatForm />
    </q-footer>

  </q-layout>
</template>

<style scoped>
  .q-page-container {
    max-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .q-page {
    overflow-y: auto;
  }

  .no-scroll {
    overflow: hidden;
  }

  .no-shadow {
    box-shadow: none;
  }
</style>