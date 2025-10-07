<script setup>
  import { ref, nextTick, watch } from 'vue';
  import { allMsg } from '@/store/chat.js';

  const chatContainer = ref(null);

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function scrollToBottom() {
    await nextTick();
    const lastMessage = chatContainer.value?.lastElementChild;
    if (!lastMessage) return;
    lastMessage.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }

  watch(allMsg, () => scrollToBottom(), { deep: true });
</script>

<template>
  <div ref="chatContainer" class="chat-messages-list">
    <div
      v-for="message in allMsg"
      :key="message.timestamp"
      class="message-item q-mb-xs row items-center"
    >
      <span
        class="username text-weight-bold q-mr-sm"
        :style="{ color: message.color }"
      >
        {{ message.username }}
      </span>
      <span class="timestamp text-caption text-grey q-mr-sm">
        {{ formatTime(message.timestamp) }}
      </span>
      <span class="message-content">
        {{ message.content }}
      </span>
    </div>
  </div>
</template>

<style scoped>
  .chat-messages-list {
    height: 100%;
    overflow-y: auto;
  }

  .username {
    font-size: 0.9rem;
  }

  .timestamp {
    font-size: 0.75rem;
  }

  .message-content {
    line-height: 1.4;
    word-wrap: break-word;
  }

  .chat-messages-list {
    scroll-behavior: smooth;
  }
</style>