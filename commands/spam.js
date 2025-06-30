import { checkCooldown } from "../lib/cooldown.js";

export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  if (!sender.endsWith("@s.whatsapp.net")) {
    await conn.sendMessage(from, { text: "❌ Seul un administrateur peut utiliser cette commande." });
    return;
  }

  if (checkCooldown(sender, "spam", 30)) {
    await conn.sendMessage(from, {
      text: "⏳ Merci d'attendre avant de relancer cette commande.",
    });
    return;
  }

  // ... reste de la commande
}
