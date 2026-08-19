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

        const uptime = process.uptime();
        const formattedUptime = formatUptime(uptime);

        const memory = process.memoryUsage();
        const memoryMB =
            (memory.rss / 1024 / 1024).toFixed(1);

        const nodeVersion =
            process.version;

        await sendInteractiveMessage(
            sock,
            m.from,
            {
                title: '🥶 FREEZER-MD • SYSTEM UPTIME',

                text:
                    `╭━━━〔 🥶 FREEZER-MD 〕━━━╮\n` +
                    `┃\n` +
                    `┃ ⚡ *SYSTEM STATUS*\n` +
                    `┃\n` +
                    `┃ 🟢 Status   : *ONLINE*\n` +
                    `┃ ⏱️ Uptime   : *${formattedUptime}*\n` +
                    `┃ 🧠 RAM      : *${memoryMB} MB*\n` +
                    `┃ 🟢 Runtime  : *Node ${nodeVersion}*\n` +
                    `┃\n` +
                    `┃ ❄️ Engine   : *FREEZER-MD*\n` +
                    `┃ 🔐 Security : *Protected*\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
                    `🥶 *FREEZER-MD IS RUNNING SMOOTHLY*`,

                footer:
                    '🥶 Freezer-MD • Advanced WhatsApp Bot',

                interactiveButtons: [
                    {
                        name: 'cta_url',

                        buttonParamsJson:
                            JSON.stringify({
                                display_text:
                                    '🥶 View Freezer Channel',

                                url:
                                    'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                            })
                    }
                ]
            }
        );

    } catch (error) {

        console.error(
            'Freezer-MD Uptime Error:',
            error
        );

        await m.reply(
            `🥶 *FREEZER-MD*\n\n` +
            `🟢 Status: *ONLINE*\n` +
            `⏱️ Uptime: *${formatUptime(process.uptime())}*`
        );
    }
});
