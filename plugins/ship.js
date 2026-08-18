'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'ship',
    name: 'ship',
    category: 'Fun',
    description: 'Calculate a fun compatibility score',
    aliases: ['love', 'compatibility'],
    filename: __filename
}, async (sock, m, args) => {

    const names = args.join(' ').trim();

    if (!names) {
        return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 💘 *SHIP*
┃
┃ Usage:
┃ .ship Freezer Sarah
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    const parts = names.split(/\s+/);

    if (parts.length < 2) {
        return m.reply('💘 *Give me two names to ship!*');
    }

    const first = parts[0];
    const second = parts.slice(1).join(' ');

    // Stable score based on the names
    const combined = `${first.toLowerCase()}${second.toLowerCase()}`;

    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0;
    }

    const score = Math.abs(hash) % 101;

    const status =
        score >= 90 ? '💍 PERFECT MATCH' :
        score >= 75 ? '❤️ STRONG MATCH' :
        score >= 50 ? '💕 GOOD MATCH' :
        score >= 30 ? '💔 POSSIBLE' :
        '🥶 FRIENDZONE';

    await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 💘 *SHIP CALCULATOR*
┃
┃ 👤 ${first}
┃ ❤️
┃ 👤 ${second}
┃
┃ 💕 *Compatibility:* ${score}%
┃
┃ ${status}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
❄️ *FREEZER-MD • FUN*`
    );
});
