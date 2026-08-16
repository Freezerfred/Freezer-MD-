'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'hidetag',
    name: 'hidetag',
    category: 'Group',
    description: 'Mention all members without showing tags',
    aliases: ['notify', 'silenttag'],
    filename: __filename
}, async (sock, m, args) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        const participants = m.groupMetadata?.participants || [];

        if (!participants.length)
            return m.reply('❌ No group members found.');

        const mentions = participants.map(p => p.id);
        const text = args.join(' ') || '📢 Attention everyone!';

        await sock.sendMessage(m.from, {
            text,
            mentions
        });

    } catch (err) {
        console.error('Freezer Hidetag Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to send hidetag.');
    }
});
