// ✅ FINAL: lib/socket.js import { checkCooldown } from './cooldown.js';

// Initialisation des configs et whitelist globales global.configs = global.configs || { autopromote: true, antibot_dm: false, antibot_group: 'off', autorevenge: true }; global.whitelist = global.whitelist || [];

export function setupSocket(conn) { conn.ev.on('group-participants.update', async (update) => { const { id: groupId, participants, action } = update;

if (action === 'add') {
  for (const participant of participants) {
    if (participant === conn.user.id && global.configs.autopromote) {
      await conn.groupParticipantsUpdate(groupId, [participant], 'promote');

      // Ajouter automatiquement les whitelistés dans le groupe
      for (const jid of global.whitelist) {
        await conn.groupParticipantsUpdate(groupId, [jid], 'add').catch(() => {});
      }
    }
  }
}

});

conn.ev.on('messages.upsert', async ({ messages }) => { const msg = messages[0]; if (!msg.message) return;

const from = msg.key.remoteJid;
const sender = msg.key.participant || msg.key.remoteJid;
const isGroup = from.endsWith("@g.us");
const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

// Auto-Revenge passive
if (isGroup && global.configs.autorevenge) {
  const attacker = sender;
  const revengeMsg = `⚔️ Auto-revanche contre @${attacker.split("@")[0]}`;
  if (!checkCooldown(attacker, 'autorevenge', 60)) {
    await conn.sendMessage(from, {
      text: revengeMsg,
      mentions: [attacker]
    });
    await conn.sendMessage(from, { text: "💥💥💥" });
  }
}

// Anti-bot DM
if (!isGroup && global.configs.antibot_dm) {
  const looksLikeBot = body.startsWith("!") || body.startsWith(">") || sender.endsWith("bot@whatsapp.net");
  if (looksLikeBot && !global.whitelist.includes(sender)) {
    await conn.sendMessage(from, { text: "⛔ Bot inactif ici. 😈" });
    return;
  }
}

// Anti-bot Groupe
if (isGroup && global.configs.antibot_group && global.configs.antibot_group !== 'off') {
  const isSuspicious = sender.endsWith("bot@whatsapp.net") || body.startsWith("!");
  const mode = global.configs.antibot_group;

  if (isSuspicious && !global.whitelist.includes(sender)) {
    switch (mode) {
      case 'warn':
        await conn.sendMessage(from, {
          text: `⚠️ @${sender.split("@")[0]}, les bots sont interdits ici.`,
          mentions: [sender]
        });
        break;
      case 'delete':
        await conn.sendMessage(from, { delete: msg.key });
        break;
      case 'kick':
        await conn.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
        break;
    }
  }
}

}); }

        
