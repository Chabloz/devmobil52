import { WSServerPubSub } from 'wsmini';
import { getColorForUsername } from '../utils/colorGenerator.mjs';

const origins = process.env.VITE_WS_HOST ?? 'localhost';

/**
 * WebSocket server instance
 * Note: port is not specified here as it will use the HTTP server port
 */
export const wsServer = new WSServerPubSub({
  origins,
  authCallback: (username) => {
    if (!username) return false;
    if (!/^[A-Za-z]+$/.test(username)) return false;
    if (username.length > 20) return false;
    const color = getColorForUsername(username);
    return { username, color };
  }
});
