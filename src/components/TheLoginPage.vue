<script setup>
  import { ref } from 'vue';
  import { ws, isAuth, allMsg, users } from '@/store/chat.js';

  const username = ref('');
  const loading = ref(false);
  const error = ref('');

  const usernameRules = [
    val => !!val || 'Username is required',
    val => val.length <= 20 || 'Maximum 20 characters',
    val => /^[A-Za-z]+$/.test(val) || 'Only letters (A-Z, a-z) allowed'
  ];

  async function handleSubmit() {
    error.value = '';
    loading.value = true;
    try {
      await ws.connect(username.value);
      await ws.sub('users', usersList => users.value = usersList);
      await ws.sub('chat', msg => allMsg.value.push(msg));
      isAuth.value = true;
    } catch (err) {
      error.value = 'Connection to server failed';
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="login-card q-pa-md" :class="{ 'no-shadow': $q.dark.isActive }">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">IM Chat</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input
            v-model="username"
            label="Username"
            :rules="usernameRules"
            :disable="loading"
            outlined
            autofocus
            maxlength="20"
            counter
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-banner v-if="error" class="bg-negative text-white q-mb-md" rounded>
            <template v-slot:avatar>
              <q-icon name="error" color="white" />
            </template>
            {{ error }}
          </q-banner>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            :loading="loading"
            :disable="!username || loading"
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
  .login-card {
    width: 100%;
    max-width: 400px;
  }

  .no-shadow {
    box-shadow: none !important;
  }
</style>
