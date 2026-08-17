'use strict';

const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

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
        // ONE MESSAGE ANIMATION
        // ─────────────────────────────────────

        const msg = await sock.sendMessage(
            m.from,
            {
                text:
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮\n` +
                    `┃\n` +
                    `┃ ⏳ *Pinging...*\n` +
                    `┃\n` +
                    `┃ ▰▱▱▱▱\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
            },
            {
                quoted: m
            }
        );

        // Slow stage 1
        await sleep(1200);

        await sock.sendMessage(
            m.from,
            {
                text:
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮\n` +
                    `┃\n` +
                    `┃ 📡 *Connecting...*\n` +
                    `┃\n` +
                    `┃ ▰▰▱▱▱\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
            },
            {
                edit: msg.key
            }
        );

        // Slow stage 2
        await sleep(1200);

        await sock.sendMessage(
            m.from,
            {
                text:
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮\n` +
                    `┃\n` +
                    `┃ ⚡ *Measuring latency...*\n` +
                    `┃\n` +
                    `┃ ▰▰▰▰▱\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━━╯`
            },
            {
                edit: msg.key
            }
        );

        // Slow stage 3
        await sleep(1200);

        // ─────────────────────────────────────
        // REAL LATENCY
        // ─────────────────────────────────────

        const latency = Date.now() - start;

        const status =
            latency <= 150
                ? '⚡ EXCELLENT'
                : latency <= 400
                ? '🚀 FAST'
                : latency <= 800
                ? '🟢 STABLE'
                : '🟡 SLOW';

        // ─────────────────────────────────────
        // FINAL RESULT — SAME MESSAGE
        // ─────────────────────────────────────

        await sock.sendMessage(
            m.from,
            {
                text:
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮\n` +
                    `┃\n` +
                    `┃ 🏓 *PONG!*\n` +
                    `┃\n` +
                    `┃ ⚡ *LATENCY:* ${latency}ms\n` +
                    `┃ 📡 *STATUS:* ${status}\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━━╯\n` +
                    `❄️ *FAST • STABLE • POWERFUL*`
            },
            {
                edit: msg.key
            }
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
            `❌ *Ping failed:* ${error.message}`
        );
    }
});
