'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'promote',
    name: 'promote',
    category: 'Group',
    description: 'Promote a member to group admin',
    aliases: ['admin'],
    filename: __filename
}, async (sock, m, args) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        let jid = m.mentionedJid?.[0] || m.quoted?.sender;

        if (!jid && args[0]) {
            let number = args[0].replace(/\D/g, '');
            if (number.startsWith('0'))
                number = '254' + number.slice(1);
            jid = `${number}@s.whatsapp.net`;
        }

        if (!jid)
            return m.reply('❌ Tag, reply to, or provide the member number.');

        await sock.groupParticipantsUpdate(
            m.from,
            [jid],
            'promote'
        );

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 👑 *ADMIN PROMOTED*
┃
┃ 👤 @${jid.split('@')[0]}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer Promote Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to promote member.');
    }
});
