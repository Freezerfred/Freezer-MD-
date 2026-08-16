'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'tagall',
    name: 'tagall',
    category: 'Group',
    description: 'Mention all group members',
    aliases: ['everyone', 'all'],
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

        const text = args.join(' ') || 'Attention everyone! 📢';

        const mentions = participants.map(p => p.id);

        const message = `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📢 *GROUP ANNOUNCEMENT*
┃
┃ ${text}
┃
╰━━━━━━━━━━━━━━━━━━━━━━

${mentions.map(jid => `@${jid.split('@')[0]}`).join(' ')}`;

        return await sock.sendMessage(m.from, {
            text: message,
            mentions
        });

    } catch (err) {
        console.error('Freezer Tagall Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to mention group members.');
    }
});
