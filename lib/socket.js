import {makeWASocket, useMemoryAuthState } from '@whiskeysockets/baileys';
import P from 'pino';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const logger = P({ level: 'silent' });

const sessionDataRaw = process.env.SESSION_JSON;
if (!sessionDataRaw) {
  console.error("❌ SESSION_JSON non défini dans les variables d'environnement.");
  process.exit(1);
}

let sessionData;
try {
  sessionData = JSON.parse(sessionDataRaw);
} catch {
  console.error("❌ SESSION_JSON mal formattée.");
  process.exit(1);
}

const { state, saveCreds } = useMemoryAuthState();
Object.assign(state.creds, sessionData.creds);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Map();

async function loadCommands() {
  const commandsDir = path.join(__dirname, '..', 'commands');
  const files = await fs.readdir(commandsDir);
  for (const file of files) {
    if (file.endsWith('.js')) {
      const cmd = await import(path.join(commandsDir, file));
      const name = file.replace('.js', '');
      commands.set(name, cmd);
    }
  }
}

export async function startBot() {
  await loadCommands();

  const conn = makeWASocket({
    logger,
    auth: state,
    printQRInTerminal: false,
    version: [2, 2314, 13],
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      if (shouldReconnect) {
        console.log('🔁 Reconnexion en cours...');
        startBot();
      } else {
        console.log('❌ Déconnecté définitivement.');
      }
    } else if (connection === 'open') {
      console.log('✅ Spectral connecté avec succès.');
    }
  });

  conn.ev.on('messages.upsert', async (m) => {
    if (!m.messages) return;
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if (!text.startsWith('😈')) return;

    const commandBody = text.slice(2).trim();
    const [commandName, ...args] = commandBody.split(/\s+/);

    if (!commands.has(commandName)) {
      await conn.sendMessage(msg.key.remoteJid, { text: `❓ Commande inconnue : ${commandName}` });
      return;
    }

    try {
      await commands.get(commandName).execute(conn, msg, args);
    } catch (e) {
      console.error('❌ Erreur commande :', e);
      await conn.sendMessage(msg.key.remoteJid, { text: `⚠️ Erreur lors de l'exécution de ${commandName}` });
    }
  });
}
