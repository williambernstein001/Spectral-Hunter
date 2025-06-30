export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;
  if (args.length === 0) {
    await conn.sendMessage(from, { text: 'Usage : 😈antibot-dm on|off' });
    return;
  }
  const option = args[0].toLowerCase();
  if (!['on', 'off'].includes(option)) {
    await conn.sendMessage(from, { text: 'Option invalide. Utilise "on" ou "off".' });
    return;
  }

  global.antibotDmEnabled = option === 'on';
  await conn.sendMessage(from, { text: `Anti-bot DM est maintenant ${option === 'on' ? 'activé' : 'désactivé'}.` });
}
