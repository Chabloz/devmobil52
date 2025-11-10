import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { wsServer } from './store/wsStore.mjs';
import { emoteCommand } from './commands/emote.mjs';
import { privateMessageCommand } from './commands/privateMessage.mjs';
import { setupUsersChannel } from './channels/users.mjs';
import { setupChatChannel } from './channels/chat.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const httpServer = http.createServer(app);

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, '../dist')));

// Register RPC commands
wsServer.addRpc('/em', emoteCommand);
wsServer.addRpc('/pm', privateMessageCommand);

// Setup channels
setupUsersChannel();
setupChatChannel();

// Start HTTP server and WebSocket server
const port = process.env.VITE_WS_PORT ? parseInt(process.env.VITE_WS_PORT) : 8888;
httpServer.listen(port, () => {
  console.log(`HTTP server listening on http://localhost:${port}`);
});

wsServer.start({ server: httpServer });
console.log(`WebSocket server started on ws://localhost:${port}`);