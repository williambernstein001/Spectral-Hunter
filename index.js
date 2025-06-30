// ✅ FINAL: index.js (Spectral Hunter)
import makeWASocket from '@whiskeysockets/baileys';
import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { default as P } from 'pino';
import * as commands from './commands/index.js';
import { setupSocket } from './lib/socket.js';

// Auth depuis sessions/spectral
const { state, saveCreds } = await useMultiFileAuthState(`./sessions/spectral`);

const conn = makeWASocket({
  auth: state,
  printQRInTerminal: false,
  logger: P({ level: 'silent' })
});

// Sauvegarde des identifiants
conn.ev.on('creds.update', saveCreds);

// Lecture des messages
conn.ev.on('messages.upsert', async ({ messages }) => {
  if (!messages || !messages[0]) return;
  const msg = messages[0];
  if (!msg.message) return;

  const from = msg.key.remoteJid;
  const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

  // Préfixe 😈
  if (!body.startsWith('😈')) return;

  const args = body.slice(1).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = commands[commandName];
  if (command && typeof command.execute === "function") {
    try {
      await command.execute(conn, msg, args);
    } catch (err) {
      console.error(err);
      await conn.sendMessage(from, { text: '❌ Erreur lors de l’exécution de la commande.' });
    }
  }
});

// Initialise le comportement (auto-promote, anti-bot, autorevenge, etc.)
setupSocket(conn);

console.log("✅ Spectral Hunter prêt. Session chargée et écoute activée.");
