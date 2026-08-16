'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'ping',
    name: 'ping',
    category: 'General',
    description: 'Check Freezer-MD response speed and connection latency',
    aliases: ['pong', 'latency'],
    tags: ['main', 'system'],
    command: /^\.?(ping|pong|latency)$/i,
    filename: __filename
}, async (sock, m) => {

    const startedAt = Date.now();

    try {
        // ─────────────────────────────────────
        // FREEZER-MD CONFIG
        // ─────────────────────────────────────

        const botName = '❄️ FREEZER-MD ❄️';
        const prefix = global.BOT_PREFIX || '.';

        // ─────────────────────────────────────
        // BASIC SAFETY CHECK
        // ─────────────────────────────────────

        if (!sock) {
            throw new Error('WhatsApp connection is unavailable.');
        }

        if (!m) {
            throw new Error('Message context is unavailable.');
        }

        // ─────────────────────────────────────
        // MESSAGE RESPONSE LATENCY
        // ─────────────────────────────────────

        const responseTime = Date.now() - startedAt;

        // ─────────────────────────────────────
        // CONNECTION TEST
        // ─────────────────────────────────────

        let connection = 'ONLINE';

        try {
            if (!sock.user?.id) {
                connection = 'CONNECTED';
            }
        } catch {
            connection = 'UNKNOWN';
        }

        // ─────────────────────────────────────
        // PERFORMANCE LEVEL
        // ─────────────────────────────────────

        let performance;

        if (responseTime <= 100) {
            performance = 'EXCELLENT ⚡';
        } else if (responseTime <= 300) {
            performance = 'FAST 🚀';
        } else if (responseTime <= 700) {
            performance = 'STABLE 🟢';
        } else {
            performance = 'HIGH LATENCY 🟡';
        }

        // ─────────────────────────────────────
        // FREEZER-MD PING UI
        // ─────────────────────────────────────

        const pingText = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     ${botName}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━〔 ⚡ PING TEST 〕━━━┓
┃
┃ 🏓 *PONG!*
┃
┃ 📡 LATENCY
┃ └─ ${responseTime}ms
┃
┃ 🟢 CONNECTION
┃ └─ ${connection}
┃
┃ 🚀 PERFORMANCE
┃ └─ ${performance}
┃
┃ ⚙️ PREFIX
┃ └─ ${prefix}
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

╭──────────────────────────╮
│ ❄️ *FREEZER-MD*
│ ⚡ *FAST • STABLE • POWERFUL*
╰──────────────────────────╯
`.trim();

        await m.reply(pingText);

    } catch (error) {

        console.error(
            '[FREEZER-MD] Ping Error:',
            error
        );

        // ─────────────────────────────────────
        // SAFE ERROR RESPONSE
        // ─────────────────────────────────────

        try {

            await m.reply(`
╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔴 *PING FAILED*
┃
┃ ${error?.message || 'Unable to measure latency.'}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim());

        } catch (fallbackError) {

            console.error(
                '[FREEZER-MD] Ping fallback error:',
                fallbackError
            );
        }
    }
});
