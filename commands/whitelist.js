// 📁 whitelist.js - système complet de gestion + protections connectées

import fs from "fs"; import path from "path";

const whitelistPath = path.resolve("./whitelist.json");

// Charger 
function loadWhitelist() { try { const data = fs.readFileSync(whitelistPath, "utf-8"); return JSON.parse(data); } catch (e) { return []; } }

// Sauvegarder 
function saveWhitelist(data) { fs.writeFileSync(whitelistPath, JSON.stringify(data, null, 2)); }

// Initialisation globale 
global.whitelist = loadWhitelist();

// Protection centrale à inclure dans socket.js 
export function isWhitelisted(jid) { return global.whitelist.includes(jid); }

// 📜 Commande whitelist 
export async function execute(conn, msg, args) { const from = msg.key.remoteJid; const sender = msg.key.participant || msg.key.remoteJid;

const action = args[0]?.toLowerCase(); let list = loadWhitelist();

switch (action) { case "add": { const jid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if (!jid) return await conn.sendMessage(from, { text: "❌ Mentionne un utilisateur." });

if (!list.includes(jid)) {
    list.push(jid);
    saveWhitelist(list);
    global.whitelist = list;
    await conn.sendMessage(from, { text: `✅ @${jid.split("@")[0]} ajouté à la whitelist.`, mentions: [jid] });
  } else {
    await conn.sendMessage(from, { text: "⚠️ Déjà whitelisté." });
  }
  break;
}

case "remove": {
  const jid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!jid) return await conn.sendMessage(from, { text: "❌ Mentionne un utilisateur." });

  if (list.includes(jid)) {
    list = list.filter(u => u !== jid);
    saveWhitelist(list);
    global.whitelist = list;
    await conn.sendMessage(from, { text: `🗑️ @${jid.split("@")[0]} retiré de la whitelist.`, mentions: [jid] });
  } else {
    await conn.sendMessage(from, { text: "ℹ️ Pas dans la whitelist." });
  }
  break;
}

case "list": {
  const text = list.length ? `📋 Whitelist :\n${list.map((u, i) => `${i + 1}. ${u}`).join("\n")}` : "🚫 Liste vide.";
  await conn.sendMessage(from, { text });
  break;
}

case "reset": {
  list = [];
  saveWhitelist([]);
  global.whitelist = [];
  await conn.sendMessage(from, { text: "🧹 Whitelist réinitialisée." });
  break;
}

default: {
  await conn.sendMessage(from, {
    text: `❔ Syntaxe :\n😈whitelist add @user\n😈whitelist remove @user\n😈whitelist list\n😈whitelist reset`
  });
}

} }

// Exemple de protection dans auto-promote (dans socket.js) 
export async function autoPromoteHandler(conn, groupMetadata) { const participants = groupMetadata.participants.map(p => p.id); const toPromote = global.whitelist.filter(jid => participants.includes(jid));

for (const jid of toPromote) { try { await conn.groupParticipantsUpdate(groupMetadata.id, [jid], "promote"); } catch (err) { console.log(Erreur promotion @${jid}, err); } } }

// Exemple d’usage dans antibot (DM ou groupe) 
export function shouldBlockUser(jid) { return !isWhitelisted(jid); 
                                      // Si pas whitelisté, alors oui, on bloque }

// Exemple dans autorevenge 
                                      export async function revengeIfNotWhitelist(conn, groupId, targetJid) { if (!isWhitelisted(targetJid)) { await conn.groupParticipantsUpdate(groupId, [targetJid], "remove"); await conn.sendMessage(groupId, { text: 🔥 Revanche : @${targetJid.split("@")[0]} expulsé., mentions: [targetJid], }); } }

