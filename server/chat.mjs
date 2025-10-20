import { WSServerPubSub, WSServerError } from 'wsmini';
import { createHash } from 'crypto';

const port = process.env.VITE_WS_PORT ? parseInt(process.env.VITE_WS_PORT) : 8888;
const origins = process.env.VITE_WS_HOST || 'localhost';

const userColors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#f1c40f', '#e91e63', '#009688', '#ff5722', '#8bc34a', '#4caf50', '#2196f3', '#9c27b0'];

function getColorForUsername(username) {
  const hash = createHash('md5').update(username).digest();
  const index = hash[0] % userColors.length;
  return userColors[index];
}

const wsServer = new WSServerPubSub({
  port,
  origins,
  authCallback: (username) => {
    if (!username) return false;
    if (!/^[A-Za-z]+$/.test(username)) return false;
    if (username.length > 20) return false;
    const color = getColorForUsername(username);
    return {username, color};
  }
});

wsServer.addRpc('/em', (data, client) => {
  wsServer.pub('chat',  {
    type: 'emote',
    content: data,
    username: client.username,
    color: client.color,
    timestamp: Date.now(),
  });
});

wsServer.addRpc('/pm', (data, {username, color}) => {
  if (typeof data !== 'string' || data.trim().length < 3) {
    throw new WSServerError('No message content');
  }
  const [to, ...content] = data.split(' ');
  const msg = content.join(' ');

  const allClients = wsServer.getChannelClients('chat');
  const toClients = allClients.filter(c => wsServer.clients.get(c).username === to);
  if (toClients.length === 0) throw new WSServerError('Recipient not found');
  const fromClients = allClients.filter(c => wsServer.clients.get(c).username === username);

  const info = {
    type: 'pm',
    content: msg,
    from: username,
    to: to,
    fromColor: color,
    toColor: wsServer.clients.get(toClients[0]).color,
    timestamp: Date.now(),
  };

  for (const fromSocket of fromClients) {
    wsServer.sendCmd(fromSocket, 'pm', info);
  }
  for (const toSocket of toClients) {
    wsServer.sendCmd(toSocket, 'pm', info);
  }
});

// Channel for the list of connected users
wsServer.addChannel('users', { usersCanPub: false });

function sendUserList() {
  const clientsData = wsServer.getChannelClientsData('chat');
  const usersList = [...new Set(clientsData.map(({ username }) => username))];
  wsServer.pub('users', usersList);
  return true;
}

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
  hookSubPost: sendUserList,
  hookUnsubPost: sendUserList,
});

wsServer.start();