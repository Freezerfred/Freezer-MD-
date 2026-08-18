'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'repo',
    name: 'repo',
    category: 'General',
    description: 'Show Freezer-MD official repository',
    aliases: ['github', 'source', 'sourcecode', 'sc'],
    tags: ['main', 'repo', 'github'],
    command: /^\.?(repo|github|source|sourcecode|sc)$/i,
    filename: __filename
}, async (sock, m) => {

    try {

        // ─────────────────────────────────────
        // FREEZER-MD INFORMATION
        // ─────────────────────────────────────

        const repoUrl =
            'https://github.com/Freezerfred/Freezer-MD-.git';

        const channelUrl =
            'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

        const owner =
            global.ownerName || 'Freezer';

        const prefix =
            global.BOT_PREFIX || '.';

        // ─────────────────────────────────────
        // REPOSITORY MESSAGE
        // ─────────────────────────────────────

        const repoText = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🚀 *OFFICIAL REPOSITORY*
┃
┃ 📦 *Project:* Freezer-MD
┃ 👑 *Owner:* ${owner}
┃ 🔧 *Prefix:* ${prefix}
┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 💻 *SOURCE CODE*
┃ ${repoUrl}
┃
┃ 📢 *OFFICIAL CHANNEL*
┃ ${channelUrl}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

❄️ *FREEZER-MD*
> *FAST • STABLE • POWERFUL*
`.trim();

        // ─────────────────────────────────────
        // SEND REPOSITORY
        // ─────────────────────────────────────

        await sock.sendMessage(
            m.from,
            {
                text: repoText,
                contextInfo: {
                    externalAdReply: {
                        title: '❄️ FREEZER-MD',
                        body: 'FAST • STABLE • POWERFUL',
                        sourceUrl: repoUrl,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            },
            {
                quoted: m
            }
        );

    } catch (err) {

        console.error(
            '[FREEZER-MD] Repo Error:',
            err
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔴 *REPOSITORY ERROR*
┃
┃ Unable to load repository
┃ information right now.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
