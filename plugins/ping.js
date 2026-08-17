'use strict';

const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

cmd({
    pattern: 'ping',
    name: 'ping',
    category: 'General',
    description: 'Measure real Freezer-MD response speed',
    aliases: ['pong', 'latency'],
    filename: __filename
}, async (sock, m) => {

    try {

        // ─────────────────────────────────────
        // REAL BOT RESPONSE TEST
        // ─────────────────────────────────────

        const start = process.hrtime.bigint();

        const pingMsg = await sock.sendMessage(m.from, {
            text: '❄️ *FREEZER-MD* • Checking response...'
        });

        const end = process.hrtime.bigint();

        const latency =
            Number(end - start) / 1_000_000;

        const ms = Math.round(latency);

        // ─────────────────────────────────────
        // STATUS
        // ─────────────────────────────────────

        const status =
            ms <= 150 ? '⚡ Excellent' :
            ms <= 400 ? '🚀 Fast' :
            ms <= 800 ? '🟢 Stable' :
            '🟡 Slow';

        // ─────────────────────────────────────
        // FINAL RESULT
        // ─────────────────────────────────────

        await sock.sendMessage(m.from, {
            text:
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🏓 *PONG!*
┃
┃ ⚡ *Response:* ${ms}ms
┃ 📡 *Status:* ${status}
┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ❄️ *FAST • STABLE • POWERFUL*
╰━━━━━━━━━━━━━━━━━━━━╯`,
            edit: pingMsg.key
        });

        // ─────────────────────────────────────
        // VIEW CHANNEL
        // ─────────────────────────────────────

        await sendInteractiveMessage(sock, m.from, {
            title: '❄️ FREEZER-MD',
            text: '📢 Get the latest Freezer-MD updates, releases and announcements.',
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
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *PING FAILED*
┃
┃ ${error?.message || 'Unknown error'}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
