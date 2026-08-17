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

        // Real WhatsApp response test
        const sent = await m.reply('❄️ *FREEZER-MD*');

        const latency = Date.now() - start;

        const status =
            latency <= 150 ? '⚡ EXCELLENT' :
            latency <= 400 ? '🚀 FAST' :
            latency <= 800 ? '🟢 STABLE' :
            '🟡 SLOW';

        await m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `🏓 *PONG:* ${latency}ms\n` +
            `📡 *STATUS:* ${status}`
        );

        // ─────────────────────────────────────
        // VIEW CHANNEL
        // ─────────────────────────────────────

        await sendInteractiveMessage(sock, m.from, {
            title: '❄️ FREEZER-MD',
            text: 'Get the latest Freezer-MD updates and releases.',
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

        console.error('[FREEZER-MD] Ping Error:', error.message);

        await m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `❌ *Ping failed:* ${error.message}`
        );
    }
});
