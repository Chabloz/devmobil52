import { WSServerPubSub } from 'wsmini';
import { getColorForUsername } from '../utils/colorGenerator.mjs';

const port = process.env.VITE_WS_PORT ? parseInt(process.env.VITE_WS_PORT) : 8888;
const origins = process.env.VITE_WS_HOST ?? 'localhost';

export const wsServer = new WSServerPubSub({
  port,
  origins,
  authCallback: (username) => {
    if (!username) return false;
    if (!/^[A-Za-z]+$/.test(username)) return false;
    if (username.length > 20) return false;
    const color = getColorForUsername(username);
    return { username, color };
  }
});
