import { ref } from "vue";
import { WSClient } from 'wsmini';

export const isAuth = ref(false);
export const users = ref([]);
export const allMsg = ref([]);
export const showUsersList = ref(false);

const wsHost = import.meta.env.VITE_WS_HOST || 'localhost';
const wsPort = import.meta.env.VITE_WS_PORT || '8888';
export const ws = new WSClient(`ws://${wsHost}:${wsPort}`);