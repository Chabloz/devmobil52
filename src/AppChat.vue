<script setup>
  import { useQuasar } from 'quasar';
  import { isAuth, ws, users, allMsg } from '@/store/chat.js';
  import TheChatToolbar from './components/TheChatToolbar.vue';
  import TheLoginPage from './components/TheLoginPage.vue';
  import TheChatForm from './components/TheChatForm.vue';
  import TheChatMessagesList from './components/TheChatMessagesList.vue';
  import TheChatUsersList from './components/TheChatUsersList.vue';

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
</script>

<template>
  <q-layout view="hHh lpr lFf">

    <q-header :class="{ 'no-shadow': $q.dark.isActive }" :elevated="!$q.dark.isActive">
      <TheChatToolbar />
    </q-header>

    <TheChatUsersList />

    <q-page-container>
      <q-page padding :class="{ 'no-scroll': !isAuth }">
        <TheLoginPage v-if="!isAuth" />
        <TheChatMessagesList v-else />
      </q-page>
    </q-page-container>

    <q-footer class="q-pa-xs" :class="{ 'bg-dark': $q.dark.isActive, 'bg-grey-2': !$q.dark.isActive }" v-if="isAuth">
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
    overflow: hidden !important;
  }

  .no-shadow {
    box-shadow: none !important;
  }
</style>