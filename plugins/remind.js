'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'remind',
    name: 'remind',
    category: 'Tools',
    description: 'Set a simple reminder',
    aliases: ['reminder', 'rem'],
    filename: __filename
}, async (sock, m, args) => {

    const input = args.join(' ').trim();

    if (!input) {
        return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⏰ *REMINDER*
┃
┃ Usage:
┃ .remind 10m Drink water
┃ .remind 1h Check the bot
┃
┃ Units: s • m • h • d
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    const match = input.match(/^(\d+(?:\.\d+)?)(s|m|h|d)\s+(.+)$/i);

    if (!match) {
        return m.reply(
`❌ *Invalid format.*

Example:
.remind 30m Call John`
        );
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const reminder = match[3].trim();

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    const delay = amount * multipliers[unit];

    if (!Number.isFinite(delay) || delay > 7 * 24 * 60 * 60 * 1000) {
        return m.reply('❌ *Reminder must be between 1 second and 7 days.*');
    }

    await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⏰ *REMINDER SET*
┃
┃ 🕐 *After:* ${amount}${unit}
┃ 📝 *Reminder:* ${reminder}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    );

    setTimeout(async () => {
        try {
            await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔔 *REMINDER*
┃
┃ 📝 ${reminder}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        } catch (error) {
            console.error('[FREEZER-MD] Reminder Error:', error.message);
        }
    }, delay);
});
