'use strict';

const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

cmd({
    pattern: 'ping',
    name: 'ping',
    category: 'General',
    description: 'Check Freezer-MD response speed',
    aliases: ['pong', 'latency'],
    filename: __filename
}, async (sock, m) => {

    try {

        const start = Date.now();

        await sock.sendPresenceUpdate('composing', m.from);

        const latency = Date.now() - start;

        const status =
            latency <= 150 ? '⚡ Excellent' :
            latency <= 400 ? '🚀 Fast' :
            latency <= 800 ? '🟢 Stable' :
            '🟡 Slow';

        await sendInteractiveMessage(sock, m.from, {
            title: '❄️ FREEZER-MD',
            text:
`╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🏓 *PONG!*
┃
┃ ⚡ *Latency:* ${latency}ms
┃ 📡 *Status:* ${status}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
❄️ *FAST • STABLE • POWERFUL*`,
            footer: 'FREEZER-MD • BUILT DIFFERENT',
            interactiveButtons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 View Channel',
                        url: 'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                    })
                }
            ]
        });

    } catch (error) {

        console.error('[FREEZER-MD] Ping Error:', error);

        await m.reply(
`❄️ *FREEZER-MD*

❌ *Ping failed:*
${error?.message || 'Unknown error'}`
        );
    }
});
