'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'add',
    name: 'add',
    category: 'Group',
    description: 'Add a member to the group',
    aliases: ['invite'],
    filename: __filename
}, async (sock, m, args) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        if (!args[0])
            return m.reply(`❄️ *FREEZER-MD*\n\nUsage: .add 2547XXXXXXXX`);

        let number = args[0].replace(/\D/g, '');

        if (number.startsWith('0'))
            number = '254' + number.slice(1);

        if (number.length < 10)
            return m.reply('❌ Invalid phone number.');

        const jid = `${number}@s.whatsapp.net`;

        await sock.groupParticipantsUpdate(
            m.from,
            [jid],
            'add'
        );

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ✅ *MEMBER ADDED*
┃
┃ 👤 @${number}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer Add Error:', err);

        return m.reply(
            `❌ *FREEZER-MD*\n\nFailed to add member.\n${String(err.message || err).slice(0, 100)}`
        );
    }
});
