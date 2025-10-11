import { WSServerPubSub, WSServerError } from 'wsmini';
import { randomInt } from '../src/utils/math.js';

const userColors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#f1c40f', '#e91e63', '#009688', '#ff5722', '#8bc34a', '#4caf50', '#2196f3', '#9c27b0'];

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

// Rpc for chat commands /em, /pm , etc.
wsServer.addRpc('/em', (data, client) => {
  wsServer.pub('chat',  {
    type: 'emote',
    content: data,
    username: client.username,
    color: client.color,
    timestamp: Date.now(),
  });
});

wsServer.addRpc('/pm', (data, client, fromSocket) => {
  if (typeof data !== 'string' || data.trim().length === 0) throw new WSServerError('No message content');
  const [to, ...content] = data.split(' ');
  const msg = content.join(' ');

  const allClients = wsServer.getChannelClients('chat');
  const toSocket = allClients.find(c => wsServer.clients.get(c).username === to);
  if (!toSocket) throw new WSServerError('Recipient not found');

  const toSend = {
    type: 'pm',
    content: msg,
    from: client.username,
    to: to,
    fromColor: client.color,
    toColor: wsServer.clients.get(toSocket).color,
    timestamp: Date.now(),
  };
  wsServer.sendCmd(fromSocket, 'pm', toSend);
  wsServer.sendCmd(toSocket, 'pm', toSend);
});



// Channel for the list of connected users
wsServer.addChannel('users', { usersCanPub: false });

// Channel for the chat messages
wsServer.addChannel('chat', {
  hookPub: (msg, client) => {
    if (!msg || !msg.content || typeof msg.content !== 'string') throw new WSServerError('Invalid message format');
    if (msg.content.length > 500) throw new WSServerError('Message too long (max 500 characters)');
    return {
      type: 'message',
      content: msg.content,
      username: client.username,
      color: client.color,
      timestamp: Date.now()
    };
  },

  hookSubPost: () => {
    const clientsData = wsServer.getChannelClientsData('chat');
    const usersList = clientsData.map(({ username }) => username);
    wsServer.pub('users', usersList);
    return true;
  },

  hookUnsubPost: () => {
    const clientsData = wsServer.getChannelClientsData('chat');
    const usersList = clientsData.map(({ username }) => username);
    wsServer.pub('users', usersList);
  }
});

wsServer.start();