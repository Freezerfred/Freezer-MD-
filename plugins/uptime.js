'use strict';

const { sendInteractiveMessage } = require('gifted-btns');
const process = require('process');

const { cmd } = require('../arslan');

function formatUptime(seconds) {
    seconds = Math.floor(seconds);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days) parts.push(`${days}d`);
    if (hours || days) parts.push(`${hours}h`);
    if (minutes || hours || days) parts.push(`${minutes}m`);

    parts.push(`${seconds}s`);

    return parts.join(' ');
}

cmd({
    pattern: 'uptime',
    name: 'uptime',
    category: 'General',
    aliases: ['up'],
    description: 'Display Freezer-MD system uptime.',
    filename: __filename
}, async (sock, m) => {

    try {

        const formattedUptime =
            formatUptime(process.uptime());

        const memory =
            process.memoryUsage();

        const memoryMB =
            (memory.rss / 1024 / 1024).toFixed(1);

        const nodeVersion =
            process.version;

        const TOP =
            '╭━━━━━━━━━━━━━━━━━━━━❄️';

        const MID =
            '┣━━━━━━━━━━━━━━━━━━━━❄️';

        const BOT =
            '╰━━━━━━━━━━━━━━━━━━━━❄️';

        const uptimeText =
`${TOP}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃ *𝗦𝗬𝗦𝗧𝗘𝗠 𝗨𝗣𝗧𝗜𝗠𝗘*
┃
${MID}
┃ 🟢 *Status:* ONLINE
┃ ⏱️ *Uptime:* ${formattedUptime}
┃ 🧠 *RAM:* ${memoryMB} MB
┃ 🟢 *Node:* ${nodeVersion}
┃
┃ ❄️ *Engine:* FREEZER-MD
┃ 🛡️ *Security:* Protected
┃
${BOT}

❄️ *FAST • STABLE • POWERFUL*
> *BUILT DIFFERENT.*`;

        await sendInteractiveMessage(
            sock,
            m.from,
            {
                title: '❄️ FREEZER-MD • UPTIME',

                text: uptimeText,

                footer:
                    '❄️ Freezer-MD • Built Different',

                interactiveButtons: [
                    {
                        name: 'cta_url',

                        buttonParamsJson:
                            JSON.stringify({
                                display_text:
                                    '📢 View Freezer Channel',

                                url:
                                    'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                            })
                    }
                ]
            }
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Uptime Error:',
            error
        );

        await m.reply(
`${'╭━━━━━━━━━━━━━━━━━━━━❄️'}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃
┃ 🟢 *Status:* ONLINE
┃ ⏱️ *Uptime:* ${formatUptime(process.uptime())}
┃
${'╰━━━━━━━━━━━━━━━━━━━━❄️'}`
        );
    }
});

