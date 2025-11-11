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

const app = express();
const httpServer = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!/^[A-Za-z]+$/.test(username)) {
    return res.status(400).json({ error: 'Username must contain only letters' });
  }
  if (username.length > 20) {
    return res.status(400).json({ error: 'Username must be 20 characters or less' });
  }

  // TODO: Generate JWT token and set it in cookie
  // const token = generateJWT({ username });
  // res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

  res.json({ success: true, username });
});

app.get('/api/foo', (req, res) => {
  res.json({ bar: 'baz' });
});

app.use(express.static(path.join(__dirname, '../dist')));

wsServer.addRpc('/em', emoteCommand);
wsServer.addRpc('/pm', privateMessageCommand);

setupUsersChannel();
setupChatChannel();

// Start HTTP server and WebSocket server
const port = process.env.VITE_WS_PORT ? parseInt(process.env.BACKEND_PORT) : 100000;
httpServer.listen(port, () => {
  console.log(`HTTP server listening on http://localhost:${port}`);
});
wsServer.start({ server: httpServer });