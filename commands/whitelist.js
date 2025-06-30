const fs = require('fs');
const path = require('path');

const whitelistFile = path.join(process.cwd(), 'whitelist.json');

function loadWhitelist() {
  try {
    const data = fs.readFileSync(whitelistFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveWhitelist(list) {
  fs.writeFileSync(whitelistFile, JSON.stringify(list, null, 2));
}

export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;

  if (args.length === 0) {
    await conn.sendMessage(from, { text: 'Usage : 😈whitelist add|remove|show @user' });
    return;
  }

  const subcmd = args[0].toLowerCase();
  let list = loadWhitelist();

  if (subcmd === 'add') {
    if (args.length < 2) {
      await conn.sendMessage(from, { text: 'Veuillez mentionner un utilisateur à ajouter.' });
      return;
    }
    const user = args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (list.includes(user)) {
      await conn.sendMessage(from, { text: 'Utilisateur déjà dans la whitelist.' });
      return;
    }
    if (list.length >= 5) {
      await conn.sendMessage(from, { text: 'Whitelist pleine (max 5).' });
      return;
    }
    list.push(user);
    saveWhitelist(list);
    await conn.sendMessage(from, { text: `Utilisateur ajouté à la whitelist : ${user}` });
  } else if (subcmd === 'remove') {
    if (args.length < 2) {
      await conn.sendMessage(from, { text: 'Veuillez mentionner un utilisateur à supprimer.' });
      return;
    }
    const user = args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    list = list.filter(u => u !== user);
    saveWhitelist(list);
    await conn.sendMessage(from, { text: `Utilisateur supprimé de la whitelist : ${user}` });
  } else if (subcmd === 'show') {
    if (list.length === 0) {
      await conn.sendMessage(from, { text: 'Whitelist vide.' });
      return;
    }
    await conn.sendMessage(from, { text: 'Whitelist :\n' + list.join('\n') });
  } else {
    await conn.sendMessage(from, { text: 'Sous-commande inconnue.' });
  }
}
