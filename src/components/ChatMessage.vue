<script setup>
  const props = defineProps({
    message: {
      type: Object,
      required: true
    }
  });

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<template>
  <div class="message-item q-mb-xs row items-center">
    <span class="timestamp text-caption text-grey q-mr-sm">
        {{ formatTime(message.timestamp) }}
    </span>

    <template v-if="message.type === 'emote'">
      <span class="emote-message text-italic" :style="{ color: message.color }">
        {{ message.username }} {{ message.content }}
      </span>
    </template>

    <template v-else-if="message.type === 'pm'">
      <span class="q-mr-sm text-grey">[private]</span>
      <span class="username text-weight-bold" :style="{ color: message.fromColor }">
        {{ message.from }}
      </span>
      @
      <span class="username text-weight-bold q-mr-sm">
        <span :style="{ color: message.toColor }">{{ message.to }}</span>:
      </span>
      <span class="message-content">
        {{ message.content }}
      </span>
    </template>

    <template v-else>
      <span class="username text-weight-bold q-mr-sm" >
        <span :style="{ color: message.color }">{{ message.username }}</span>:
      </span>
      <span class="message-content">
        {{ message.content }}
      </span>
    </template>
  </div>
</template>

<style scoped>
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

  .emote-message {
    line-height: 1.4;
    word-wrap: break-word;
  }
</style>
