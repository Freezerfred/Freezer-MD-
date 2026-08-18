'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'setprefix',
    name: 'setprefix',
    category: 'Owner',
    description: 'Change Freezer-MD command prefix',
    aliases: ['prefix'],
    filename: __filename
}, async (sock, m, args) => {

    const newPrefix = args[0]?.trim();

    if (!newPrefix) {
        return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔧 *PREFIX SETTINGS*
┃
┃ Current:
┃ ${global.BOT_PREFIX || '.'}
┃
┃ Usage:
┃ .setprefix !
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    if (newPrefix.length > 3) {
        return m.reply(
            '❌ *Prefix must be 1–3 characters.*'
        );
    }

    global.BOT_PREFIX = newPrefix;

    await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ✅ *PREFIX UPDATED*
┃
┃ New Prefix:
┃ ${newPrefix}
┃
┃ Example:
┃ ${newPrefix}menu
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    );
});
