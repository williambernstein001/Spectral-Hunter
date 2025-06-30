export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;

  if (!from.endsWith("@g.us")) {
    await conn.sendMessage(from, { text: "❌ Cette commande doit être utilisée dans un groupe." });
    return;
  }

  const mode = args[0]?.toLowerCase();
  const validModes = ["warn", "delete", "kick", "off"];

  if (!validModes.includes(mode)) {
    await conn.sendMessage(from, {
      text: "❌ Utilise : 😈antibot-group warn|delete|kick|off",
    });
    return;
  }

  global.configs = global.configs || {};
  global.configs.antibot_group = mode;

  await conn.sendMessage(from, {
    text: `🛡️ Mode Anti-Bot Groupe réglé sur : *${mode.toUpperCase()}*`,
  });
      }
