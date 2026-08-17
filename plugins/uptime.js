const { sendInteractiveMessage } = require('gifted-btns');
const process = require('process');

const { cmd } = require('../arslan');

cmd({
    pattern: "uptime",
    name: 'uptime',
    category: 'General',
    aliases: ['up'],
    description: 'Check how long Freezer-MD has been running.',
    filename: __filename
}, async (sock, m) => {

    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const formattedTime =
        `${hours}h ${minutes}m ${seconds}s`;

    await sendInteractiveMessage(sock, m.from, {
        title: '❄️ FREEZER-MD • UPTIME',
        text:
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮\n` +
            `┃\n` +
            `┃ ⚡ *SYSTEM STATUS*\n` +
            `┃\n` +
            `┃ 🟢 Status: Online\n` +
            `┃ ⏱️ Uptime: *${formattedTime}*\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`,
        footer: '❄️ Freezer-MD • Advanced WhatsApp Bot',
        interactiveButtons: [
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '❄️ View Freezer Channel',
                    url: 'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                })
            }
        ]
    });
});
