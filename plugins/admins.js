'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'admins',
    name: 'admins',
    category: 'Group',
    description: 'List group administrators',
    aliases: ['adminlist'],
    filename: __filename
}, async (sock, m) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        const participants = m.groupMetadata?.participants || [];
        const admins = participants.filter(p => p.admin);

        if (!admins.length)
            return m.reply('❌ No group admins found.');

        const mentions = admins.map(p => p.id);

        const list = admins
            .map((p, i) => `┃ ${i + 1}. @${p.id.split('@')[0]}`)
            .join('\n');

        await sock.sendMessage(m.from, {
            text: `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃       👑 *GROUP ADMINS*
┃
╰━━━━━━━━━━━━━━━━━━━━━━
╭━━━━━━━━━━━━━━━━━━━━━━
${list}
╰━━━━━━━━━━━━━━━━━━━━━━`,
            mentions
        });

    } catch (err) {
        console.error('Freezer Admins Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to fetch group admins.');
    }
});
