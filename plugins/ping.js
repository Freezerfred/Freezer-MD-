'use strict';

const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

        // ─────────────────────────────────────
        // PING ANIMATION
        // ─────────────────────────────────────

        const pingMsg = await m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `⏳ *Pinging...*`
        );

        await sleep(400);

        try {
            await sock.sendMessage(m.from, {
                text:
                    `❄️ *FREEZER-MD*\n\n` +
                    `📡 *Connecting...*\n` +
                    `▰▱▱▱▱`
            }, {
                quoted: pingMsg
            });
        } catch {}

        await sleep(400);

        try {
            await sock.sendMessage(m.from, {
                text:
                    `❄️ *FREEZER-MD*\n\n` +
                    `⚡ *Measuring latency...*\n` +
                    `▰▰▰▱▱`
            }, {
                quoted: pingMsg
            });
        } catch {}

        await sleep(300);

        // ─────────────────────────────────────
        // REAL RESPONSE TEST
        // ─────────────────────────────────────

        const latency = Date.now() - start;

        const status =
            latency <= 150 ? '⚡ EXCELLENT' :
            latency <= 400 ? '🚀 FAST' :
            latency <= 800 ? '🟢 STABLE' :
            '🟡 SLOW';

        // ─────────────────────────────────────
        // FINAL RESULT
        // ─────────────────────────────────────

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🏓 *PONG!*
┃
┃ ⚡ *LATENCY:* ${latency}ms
┃ 📡 *STATUS:* ${status}
┃
╰━━━━━━━━━━━━━━━━━━━━━━
❄️ *FAST • STABLE • POWERFUL*`
        );

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

        console.error(
            '[FREEZER-MD] Ping Error:',
            error.message
        );

        await m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `❌ *Ping failed*\n` +
            `┃ ${error.message}`
        );
    }
});
