'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'countdown',
    name: 'countdown',
    category: 'Tools',
    description: 'Calculate time remaining until a date',
    aliases: ['cd', 'until'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const input = args.join(' ').trim();

        if (!input) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⏳ *COUNTDOWN*
┃
┃ Usage:
┃ .countdown 2026-12-31
┃
┃ Or:
┃ .countdown 2026-12-31 18:00
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        const target = new Date(input);

        if (Number.isNaN(target.getTime())) {
            return m.reply('❌ *Invalid date format.*');
        }

        const now = new Date();
        const difference = target.getTime() - now.getTime();

        if (difference <= 0) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⏰ *TIME HAS ARRIVED*
┃
┃ The specified date has
┃ already passed.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        const seconds = Math.floor(difference / 1000);

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⏳ *COUNTDOWN*
┃
┃ 📅 *Target:* ${target.toLocaleString('en-GB')}
┃
┃ 🗓️ *Remaining:*
┃ ${days}d ${hours}h ${minutes}m ${secs}s
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Countdown Error:',
            error.message
        );

        await m.reply(
`❌ *Unable to calculate countdown.*`
        );
    }
});
