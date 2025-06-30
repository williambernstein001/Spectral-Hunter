import { checkCooldown } from "../lib/cooldown.js";

export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  // Vérification permission (admin uniquement)
  if (!sender.endsWith("@s.whatsapp.net")) {
    await conn.sendMessage(from, { text: "❌ Seul un administrateur peut utiliser cette commande." });
    return;
  }

  // Cooldown de 30 secondes
  if (checkCooldown(sender, "spam", 30)) {
    await conn.sendMessage(from, {
      text: "⏳ Merci d'attendre avant de relancer cette commande.",
    });
    return;
  }

  // Extraction de la mention ciblée
  const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!mention) {
    await conn.sendMessage(from, { text: "❌ Mentionne un membre à spammer." });
    return;
  }

  // Vérification whitelist
  if (global.whitelist.includes(mention)) {
    await conn.sendMessage(from, { text: "⚠️ Impossible de spammer un membre whitelisté." });
    return;
  }

  // Nombre de messages à envoyer
  const count = parseInt(args[1], 10);
  if (!count || count < 1 || count > 30) {
    await conn.sendMessage(from, { text: "❌ Indique un nombre de messages entre 1 et 30." });
    return;
  }

  const spamMessage = `@${mention.split("@")[0]} tu es spammé ! 😈`;

  try {
    for (let i = 0; i < count; i++) {
      await conn.sendMessage(from, {
        text: spamMessage,
        mentions: [mention],
      });
    }
    await conn.sendMessage(from, { text: `📢 Spam de ${count} messages envoyé à @${mention.split("@")[0]}.`, mentions: [mention] });
  } catch (e) {
    await conn.sendMessage(from, { text: "❌ Erreur lors de l’envoi du spam." });
  }
      }
