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

    return [
        days ? `${days}d` : null,
        hours ? `${hours}h` : null,
        minutes ? `${minutes}m` : null,
        `${seconds}s`
    ].filter(Boolean).join(' ');
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
        const uptime = formatUptime(process.uptime());

        const memory =
            (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

        await sendInteractiveMessage(sock, m.from, {

            title: '🥶 FREEZER-MD • UPTIME',

            text:
`╭──────────────────────────╮
│      🥶 *FREEZER-MD*      │
├──────────────────────────┤
│ ⚡ *SYSTEM STATUS*        │
│                          │
│ 🟢 Status   : *ONLINE*   │
│ ⏱️ Uptime   : *${uptime}* │
│ 🧠 RAM      : *${memory} MB*
│ ⚙️ Runtime  : *Node.js*  │
│                          │
│ ❄️ Engine   : *FREEZER*  │
│ 🔐 Security : *ACTIVE*   │
├──────────────────────────┤
│ 🥶 *RUNNING SMOOTHLY*    │
╰──────────────────────────╯`,

            footer: '🥶 Freezer-MD • Advanced WhatsApp Bot',

            interactiveButtons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🥶 View Freezer Channel',
                        url: 'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                    })
                }
            ]
        });

    } catch (error) {

        console.error(
            'Freezer-MD Uptime Error:',
            error
        );

        await m.reply(
`╭──────────────────────────╮
│      🥶 *FREEZER-MD*      │
├──────────────────────────┤
│ 🟢 Status : *ONLINE*     │
│ ⏱️ Uptime : *${formatUptime(process.uptime())}*
╰──────────────────────────╯`
        );
    }
});
