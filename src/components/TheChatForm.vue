<script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { ws } from '@/store/chat.js';

  const $q = useQuasar();
  const message = ref('');
  const inputMsg = ref(null);

  async function handleSubmit() {
    if (!message.value.trim()) return;
    try {
      await ws.pub('chat', {content: message.value});
      message.value = '';
      inputMsg.value.focus();
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Failed to send message. Please try again.',
        timeout: 2000,
        position: 'top',
      });
    }
  }

  onMounted(() => inputMsg.value.focus());
</script>

<template>
  <q-form @submit.prevent="handleSubmit" class="chat-form">
    <q-input
      ref="inputMsg"
      filled
      dense
      maxlength="500"
      v-model.trim="message"
      label="Message"
      class="full-width"
    />
  </q-form>
</template>

<style scoped>
  .chat-form {
    width: 100%;
  }
</style>