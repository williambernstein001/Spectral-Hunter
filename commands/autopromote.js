export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  if (args.length === 0) {
    await conn.sendMessage(from, { text: 'Usage : 😈autopromote on|off' });
    return;
  }

  const option = args[0].toLowerCase();
  if (!['on', 'off'].includes(option)) {
    await conn.sendMessage(from, { text: 'Option invalide. Utilise "on" ou "off".' });
    return;
  }

  // Stockage simple dans fichier (exemple)
  // Ici tu peux utiliser une base ou fichier JSON pour sauvegarder l’état

  // Pour l'exemple on simule un stockage global
  global.autopromoteEnabled = option === 'on';

  await conn.sendMessage(from, { text: `Auto promote est maintenant ${option === 'on' ? 'activé' : 'désactivé'}.` });
    }
