'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'setdesc',
    name: 'setdesc',
    category: 'Group',
    description: 'Change the group description',
    aliases: ['groupdesc', 'gdesc'],
    filename: __filename
}, async (sock, m, args) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        const desc = args.join(' ').trim();

        if (!desc)
            return m.reply(
                `❄️ *FREEZER-MD*\n\nUsage:\n.setdesc Welcome to Freezer Cartel ❄️`
            );

        await sock.groupUpdateDescription(m.from, desc);

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📝 *DESCRIPTION UPDATED*
┃
┃ ${desc.substring(0, 200)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer SetDesc Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to update group description.');
    }
});
