<script setup>
  import { ws, isAuth } from '@/store/chat.js';

  function handleLogout() {
    ws.close();
    isAuth.value = false;
  }
</script>

<template>
  <q-toolbar>
    <q-toolbar-title>
      IM - Chat
    </q-toolbar-title>

    <q-btn v-if="isAuth" @click="handleLogout" label="Logout" icon="logout" color="secondary" size="sm" />
  </q-toolbar>
</template>