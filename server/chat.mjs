import { WSServerPubSub, WSServerError } from 'wsmini';
import { randomHSL } from '../src/utils/math.js';

const wsServer = new WSServerPubSub({
  port: 8888,
  origins: 'localhost',
  authCallback: (token, request, wsServer) => {
    if (!token) return false;
    if (!/^[A-Za-z]+$/.test(token)) return false;
    if (token.length > 20) return false;
    return {
      username: token,
      color: randomHSL('70%', '60%')
    };
  }
});

wsServer.addChannel('chat', {
  hookPub: (msg, client, wsServer) => {
    if (!msg || !msg.content || typeof msg.content !== 'string') {
      throw new WSServerError('Invalid message format');
    }
    if (msg.content.length > 500) {
      throw new WSServerError('Message too long (max 500 characters)');
    }
    return {
      content: msg.content,
      username: client.username,
      color: client.color,
      timestamp: Date.now()
    };
  }
});

wsServer.start();
