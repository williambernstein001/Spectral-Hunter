const cooldowns = new Map();

/**
 * Check if user is on cooldown
 * @param {string} jid - user JID
 * @param {string} command - command name (optional for per-command cooldown)
 * @param {number} cooldownSeconds - cooldown duration in seconds
 * @returns {boolean} true if on cooldown
 */
export function checkCooldown(jid, command = "global", cooldownSeconds = 60) {
  const key = `${jid}_${command}`;
  const now = Date.now();

  if (cooldowns.has(key)) {
    const expire = cooldowns.get(key);
    if (now < expire) {
      return true; // cooldown active
    }
  }
  cooldowns.set(key, now + cooldownSeconds * 1000);
  return false;
}
