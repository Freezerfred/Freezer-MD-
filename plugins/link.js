'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'link',
    name: 'link',
    category: 'Group',
    description: 'Get the group invite link',
    aliases: ['grouplink', 'invite'],
    filename: __filename
}, async (sock, m) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        const code = await sock.groupInviteCode(m.from);
        const link = `https://chat.whatsapp.com/${code}`;
        const name = m.groupMetadata?.subject || 'Group';

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔗 *GROUP INVITE*
┃
┃ 🏷️ *NAME:* ${name}
┃
┃ ${link}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer Link Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to get group invite link.');
    }
});
