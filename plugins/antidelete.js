'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'antidelete',
    name: 'antidelete',
    aliases: ['ad', 'antidel'],
    category: 'Admin',
    description: 'Configure Freezer-MD Anti-Delete protection',
    filename: __filename
}, async (sock, m, args) => {

    if (!m.isOwner) return;

    const input = (args[0] || '').toLowerCase();

    // ─────────────────────────────────────
    // DASHBOARD
    // ─────────────────────────────────────

    if (!['inchat', 'indm', 'false'].includes(input)) {

        const current =
            global.antidelete === 'false'
                ? '🔴 *DISABLED*'
                : `🟢 *ACTIVE* (${global.antidelete})`;

        return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🛡️ *ANTI-DELETE*
┃
┃ 📊 *Current:* ${current}
┃
┃ ⚙️ *Available Modes*
┃
┃ ◦ ${global.BOT_PREFIX || '.'}antidelete inchat
┃   └─ Recover in the chat
┃
┃ ◦ ${global.BOT_PREFIX || '.'}antidelete indm
┃   └─ Send recovery to your DM
┃
┃ ◦ ${global.BOT_PREFIX || '.'}antidelete false
┃   └─ Disable protection
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❄️ *FREEZER-MD*
> *PROTECTION • CONTROL • RELIABILITY*`
        );
    }

    // ─────────────────────────────────────
    // UPDATE SETTING
    // ─────────────────────────────────────

    global.antidelete = input;

    await m.react(
        input === 'false'
            ? '❌'
            : '🛡️'
    );

    // ─────────────────────────────────────
    // SUCCESS RESPONSE
    // ─────────────────────────────────────

    const status =
        input === 'false'
            ? '🔴 *DISABLED*'
            : `🟢 *ENABLED* (${input})`;

    return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🛡️ *ANTI-DELETE UPDATED*
┃
┃ 📊 *Status:* ${status}
┃ ⚙️ *Engine:* OPERATIONAL
┃
┃ ✅ *Settings applied successfully*
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❄️ *FREEZER-MD*
> *PROTECTION ENABLED*`
    );
});
