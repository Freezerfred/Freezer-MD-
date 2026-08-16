'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'channelid',
    name: 'channelid',
    category: 'Owner',
    aliases: ['chid', 'getchannelid'],
    description: 'Get the real WhatsApp Channel JID from a channel invite link',
    filename: __filename
}, async (sock, m) => {

    // Owner protection
    if (!m.isOwner && !m.isDev) {
        return m.reply('❌ This command is restricted to the bot owner.');
    }

    try {

        const channelUrl =
            global.channelUrl ||
            'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

        // Extract the invite code from:
        // https://whatsapp.com/channel/XXXXXXXX
        const match = channelUrl.match(
            /whatsapp\.com\/channel\/([^/?]+)/i
        );

        if (!match) {
            return m.reply(
                '❌ Invalid WhatsApp Channel URL.\n\n' +
                'Example:\n' +
                'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
            );
        }

        const inviteCode = match[1];

        await m.reply(
            '🔎 *FREEZER-MD CHANNEL RESOLVER*\n\n' +
            '⏳ Resolving your channel...\n' +
            `🔗 Invite: ${inviteCode}`
        );

        const metadata = await sock.newsletterMetadata(
            'invite',
            inviteCode
        );

        if (!metadata) {
            return m.reply(
                '❌ WhatsApp returned no channel metadata.\n\n' +
                'Make sure the channel link is valid and try again.'
            );
        }

        const jid =
            metadata.id ||
            metadata.jid ||
            metadata.newsletterJid;

        if (!jid) {
            console.log(
                'FREEZER-MD CHANNEL METADATA:',
                metadata
            );

            return m.reply(
                '⚠️ Channel found, but no JID was returned.\n\n' +
                'Check your terminal logs for the complete metadata.'
            );
        }

        console.log(
            '\n╭━━━〔 ❄️ FREEZER-MD CHANNEL 〕━━━╮'
        );
        console.log('┃');
        console.log(`┃ 📢 Name: ${metadata.name || 'Unknown'}`);
        console.log(`┃ 🆔 JID: ${jid}`);
        console.log(`┃ 🔗 Code: ${inviteCode}`);
        console.log('┃');
        console.log(
            '╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n'
        );

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📢 *CHANNEL FOUND*
┃
┃ 🏷️ *NAME:* ${metadata.name || 'Unknown'}
┃ 🆔 *JID:* 
┃ \`${jid}\`
┃
┃ 🔗 *CHANNEL:*
┃ ${channelUrl}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Real newsletter JID obtained.*

Copy the JID above and send it to me.
I will wire it into your `.menu`, `.channel`, and other Freezer-MD plugins.`
        );

    } catch (error) {

        console.error(
            '❌ Freezer-MD Channel Resolver:',
            error
        );

        await m.reply(
            `❌ *CHANNEL RESOLUTION FAILED*\n\n` +
            `Error: ${error.message}\n\n` +
            `Check your Baileys version and make sure the bot is connected.`
        );
    }
});
