export async function execute(conn, msg, args) {
  const from = msg.key.remoteJid;

  const helpText = `
📘 *Spectral Hunter - Aide utilisateur*

Spectral est un bot de protection et de contre-attaque.
Il fonctionne avec une session WhatsApp valide (via code pair) et peut :
- Se promouvoir seul en admin
- Protéger les groupes des bots indésirables
- Répliquer automatiquement aux attaques
- Spammer ou crasher les ennemis

🧪 Exemple d’utilisation :
• 😈autopromote on
• 😈antibot-dm on
• 😈antibot-group kick
• 😈spam @user 5
• 😈crash @user

📝 Gestion :
• 😈status → Voir ce qui est activé
• 😈menu   → Voir toutes les commandes

👥 Équipe : Chaque bot peut fonctionner en tandem avec d'autres (comme Surgical).
Les bots alliés doivent être ajoutés à la whitelist.

`.trim();

  await conn.sendMessage(from, { text: helpText });
    }
