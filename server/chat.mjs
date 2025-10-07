import { WSServerPubSub, WSServerError } from 'wsmini';
import { randomInt } from '../src/utils/math.js';

const userColors = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#f1c40f',
  '#e91e63',
  '#009688',
  '#ff5722',
  '#8bc34a',
  '#ff9800',
  '#4caf50',
  '#2196f3',
  '#9c27b0',
];

function getRandomColor() {
  return userColors[randomInt(0, userColors.length - 1)];
}

const wsServer = new WSServerPubSub({
  port: 8888,
  origins: 'localhost',
  authCallback: (token, request, wsServer) => {
    if (!token) return false;
    if (!/^[A-Za-z]+$/.test(token)) return false;
    if (token.length > 20) return false;
    return {
      username: token,
      color: getRandomColor()
    };
  }
});

wsServer.addChannel('users', {
  usersCanPub: false,
});

wsServer.addChannel('chat', {
  hookPub: (msg, client, wsServer) => {
    if (!msg || !msg.content || typeof msg.content !== 'string') throw new WSServerError('Invalid message format');
    if (msg.content.length > 500) throw new WSServerError('Message too long (max 500 characters)');
    return {
      content: msg.content,
      username: client.username,
      color: client.color,
      timestamp: Date.now()
    };
  },
  hookSubPost: (msg, client) => {
    const clientsData = wsServer.getChannelClientsData('chat');
    const usersList = clientsData.map(({ username }) => username);
    wsServer.pub('users', usersList);
    return true;
  },
  hookUnsubPost: (client) => {
    const clientsData = wsServer.getChannelClientsData('chat');
    const usersList = clientsData.map(({ username }) => username);
    wsServer.pub('users', usersList);
  }
});

wsServer.start();