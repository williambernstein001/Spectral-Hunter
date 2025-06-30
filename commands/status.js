export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;

  // Récupération des configs actuelles (fallback si non défini)
  const configs = global.configs || {};

  const statusMessage = `
🧠 *Spectral Hunter - État des modules actifs* 😈

• Autopromote       : ${configs.autopromote ? "✅ ON" : "❌ OFF"}
• Antibot (DM)      : ${configs.antibot_dm ? "✅ ON" : "❌ OFF"}
• Antibot (Groupe)  : ${configs.antibot_group ? `🎯 ${configs.antibot_group.toUpperCase()}` : "❌ OFF"}
• Autorevenge       : ${configs.autorevenge ? "✅ ON" : "❌ OFF"}

📌 Modules à venir :
• Whitelist : ${Array.isArray(global.whitelist) ? `${global.whitelist.length} entrées` : "non initialisée"}
• Session ID : ${process.env.SESSION_ID ? "🔐 Chargée" : "❌ Aucune"}
  `.trim();

  await conn.sendMessage(from, { text: statusMessage });
                }
