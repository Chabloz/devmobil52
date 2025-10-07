import { ref } from "vue";
import { WSClient } from 'wsmini';

export const isAuth = ref(false);
export const users = ref([]);
export const allMsg = ref([]);
export const ws = new WSClient('ws://localhost:8888');