import { WSServerError } from 'wsmini';
import { wsServer } from './store/wsStore.mjs';
import { emoteCommand } from './commands/emote.mjs';
import { privateMessageCommand } from './commands/privateMessage.mjs';

wsServer.addRpc('/em', emoteCommand);
wsServer.addRpc('/pm', privateMessageCommand);

wsServer.addChannel('users', { usersCanPub: false });

function sendUserList() {
  const clientsData = wsServer.getChannelClientsData('chat');
  const usersList = [...new Set(clientsData.map(({ username }) => username))];
  wsServer.pub('users', usersList);
  return true;
}

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