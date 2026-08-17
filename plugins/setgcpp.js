'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'setgcpp',
    name: 'setgcpp',
    category: 'Group',
    description: 'Change the group profile picture',
    aliases: ['setppgc', 'gcpp'],
    filename: __filename
}, async (sock, m) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        if (!m.quoted?.message?.imageMessage)
            return m.reply(
                `❄️ *FREEZER-MD*\n\nReply to an image with:\n.setgcpp`
            );

        const image = await m.quoted.download();

        await sock.updateProfilePicture(m.from, image);

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🖼️ *GROUP PICTURE UPDATED*
┃
┃ ✅ New profile picture
┃   has been applied.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer SetGCPP Error:', err);
        return m.reply(
            '❌ *FREEZER-MD*\n\nFailed to update group picture.'
        );
    }
});
