'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'revoke',
    name: 'revoke',
    category: 'Group',
    description: 'Reset the group invite link',
    aliases: ['resetlink'],
    filename: __filename
}, async (sock, m) => {
    try {
        if (!m.isGroup)
            return m.reply('❄️ *FREEZER-MD*\n\nThis command is for groups only.');

        if (!m.isAdmin && !m.isOwner)
            return m.reply('❌ Only group admins can use this command.');

        await sock.groupRevokeInvite(m.from);

        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔄 *LINK RESET SUCCESSFUL*
┃
┃ The previous group invite
┃ link is no longer valid.
┃
┃ 🔐 A new link has been created.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

    } catch (err) {
        console.error('Freezer Revoke Error:', err);
        return m.reply('❌ *FREEZER-MD*\n\nFailed to reset the group invite link.');
    }
});
