'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: "group",
    name: 'group',
    category: 'Group',
    description: 'Manage Freezer-MD group settings',
    aliases: ['gsettings', 'grup', 'gc'],
    tags: ['group'],
    command: /^\.?(group|gsettings|grup|gc)$/i,
    filename: __filename
}, async (sock, m, args) => {

    try {

        const prefix = global.BOT_PREFIX || '.';

        // ─────────────────────────────────────────────
        // GROUP CHECK
        // ─────────────────────────────────────────────

        if (!m.isGroup) {
            return await m.reply(
                `❄️ *FREEZER-MD*\n\n` +
                `╭━━━〔 ⚠️ ERROR 〕\n` +
                `┃\n` +
                `┃ This command can only\n` +
                `┃ be used inside groups.\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // ADMIN / OWNER CHECK
        // ─────────────────────────────────────────────

        if (!m.isOwner && !m.isAdmin) {
            return await m.reply(
                `❄️ *FREEZER-MD*\n\n` +
                `╭━━━〔 🛡️ ACCESS DENIED 〕\n` +
                `┃\n` +
                `┃ Only group admins or\n` +
                `┃ the bot owner can use\n` +
                `┃ this command.\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // GROUP INFORMATION
        // ─────────────────────────────────────────────

        if (!args.length) {

            const currentName =
                m.groupMetadata?.subject || 'Unknown';

            const currentDesc =
                m.groupMetadata?.desc?.toString() ||
                'No description';

            const memberCount =
                m.groupMetadata?.participants?.length || 0;

            const isMuted =
                m.groupMetadata?.announce || false;

            const infoText = `
╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃      *GROUP MANAGEMENT*
┃
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━━〔 👥 GROUP INFO 〕
┃
┃ 🏷️ *NAME:* ${currentName}
┃ 👥 *MEMBERS:* ${memberCount}
┃ 🔒 *STATUS:* ${isMuted
    ? 'Admin Only'
    : 'Everyone'}
┃ 📝 *DESCRIPTION:*
┃ ${currentDesc.substring(0, 100)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━━〔 ⚙️ COMMANDS 〕
┃
┃ ❄️ ${prefix}group name <text>
┃ ❄️ ${prefix}group desc <text>
┃ ❄️ ${prefix}group mute
┃ ❄️ ${prefix}group unmute
┃ ❄️ ${prefix}group reset
┃
╰━━━━━━━━━━━━━━━━━━━━━━

> *Freezer-MD Group Management*
`.trim();

            return await m.reply(infoText);
        }

        // ─────────────────────────────────────────────
        // COMMAND PARSER
        // ─────────────────────────────────────────────

        const command =
            args[0].toLowerCase();

        const text =
            args.slice(1).join(' ').trim();

        // ─────────────────────────────────────────────
        // CHANGE GROUP NAME
        // ─────────────────────────────────────────────

        if (command === 'name') {

            if (!text) {
                return await m.reply(
                    `❌ *FREEZER-MD ERROR*\n\n` +
                    `Please provide a new group name.\n\n` +
                    `Example:\n` +
                    `${prefix}group name Freezer Cartel`
                );
            }

            const oldName =
                m.groupMetadata?.subject || 'Unknown';

            await sock.groupUpdateSubject(
                m.from,
                text
            );

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ✅ *GROUP NAME UPDATED*
┃
┃ 🏷️ *OLD:* ${oldName}
┃ ✨ *NEW:* ${text}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // CHANGE GROUP DESCRIPTION
        // ─────────────────────────────────────────────

        if (command === 'desc') {

            if (!text) {
                return await m.reply(
                    `❌ *FREEZER-MD ERROR*\n\n` +
                    `Please provide a new group description.\n\n` +
                    `Example:\n` +
                    `${prefix}group desc Welcome to Freezer Cartel`
                );
            }

            await sock.groupUpdateDescription(
                m.from,
                text
            );

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ✅ *DESCRIPTION UPDATED*
┃
┃ 📝 *NEW DESCRIPTION:*
┃ ${text.substring(0, 200)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // MUTE GROUP
        // ─────────────────────────────────────────────

        if (command === 'mute') {

            await sock.groupSettingUpdate(
                m.from,
                'announcement'
            );

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔒 *GROUP MUTED*
┃
┃ Only group admins can
┃ send messages now.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // UNMUTE GROUP
        // ─────────────────────────────────────────────

        if (command === 'unmute') {

            await sock.groupSettingUpdate(
                m.from,
                'not_announcement'
            );

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔓 *GROUP UNMUTED*
┃
┃ Everyone can send
┃ messages again.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // RESET DESCRIPTION
        // ─────────────────────────────────────────────

        if (command === 'reset') {

            await sock.groupUpdateDescription(
                m.from,
                ''
            );

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🧹 *DESCRIPTION RESET*
┃
┃ The group description
┃ has been cleared.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // INVALID COMMAND
        // ─────────────────────────────────────────────

        return await m.reply(
            `❌ *FREEZER-MD ERROR*\n\n` +
            `Invalid option: *${command}*\n\n` +
            `Available options:\n` +
            `❄️ name\n` +
            `❄️ desc\n` +
            `❄️ mute\n` +
            `❄️ unmute\n` +
            `❄️ reset\n\n` +
            `Example:\n` +
            `${prefix}group mute`
        );

    } catch (err) {

        console.error(
            '❌ Freezer Group Error:',
            err
        );

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *GROUP ACTION FAILED*
┃
┃ Something went wrong while
┃ updating the group settings.
┃
┃ 🛠️ *ERROR:*
┃ ${String(err.message || err).substring(0, 150)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );
    }
});
