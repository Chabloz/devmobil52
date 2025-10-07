<script setup>
import { isAuth } from '@/store/chat.js';

import TheChatToolbar from './components/TheChatToolbar.vue';
import TheLoginPage from './components/TheLoginPage.vue';
// import TheChatForm from './components/TheChatForm.vue';
// import BaseChatMsg from './components/BaseChatMsg.vue';

</script>

<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated v-if="isAuth">
      <TheChatToolbar  />
    </q-header>

    <q-page-container>
      <TheLoginPage v-if="!isAuth" />
      <template v-else>
        page
        <!-- <q-list padding class="column">
          <BaseChatMsg v-for="msg in allMsg" :key="msg.id" :msg="msg" />
        </q-list> -->
      </template>
    </q-page-container>

    <q-footer class="bg-grey-4 q-pa-xs" v-if="isAuth">
      <!-- <TheChatForm /> -->
       form
    </q-footer>

  </q-layout>
</template>

<style scoped></style>