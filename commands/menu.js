export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;

  const menu = `
📖 *Spectral Hunter - Menu des commandes disponibles* 😈

🔧 Fonctions système :
• 😈status                 
• 😈menu                  
• 😈read / 😈help         

🛡️ Défense & sécurité :
• 😈autopromote on/off     
• 😈antibot-dm on/off      
• 😈antibot-group [mode]   
• 😈whitelist add/remove   

⚔️ Riposte & attaque :
• 😈autorevenge on/off     
• 😈spam @membre 10      
• 😈crash @membre         

✅ Utilise uniquement 😈 comme préfixe pour toutes les commandes.
`.trim();

  await conn.sendMessage(from, { text: menu });
}
