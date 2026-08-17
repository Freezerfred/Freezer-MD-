'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'setname',
    name: 'setname',
    category: 'Group',
    description: 'Change the group name',
    aliases: ['groupname', 'gname'],
    filename: __filename
}, async (sock, m, args) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        const name = args.join(' ').trim();

        if (!name)
            return m.reply(
                `❄️ *FREEZER-MD*\n\nUsage:\n.setname New Group Name`
            );

        const oldName = m.groupMetadata?.subject || 'Unknown';

        await sock.groupUpdateSubject(m.from, name);

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🏷️ *GROUP NAME UPDATED*
┃
┃ OLD: ${oldName}
┃ NEW: ${name}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer SetName Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to update group name.');
    }
});
