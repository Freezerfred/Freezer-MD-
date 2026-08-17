'use strict';

const os = require('os');
const process = require('process');
const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

cmd({
    pattern: 'ping',
    name: 'ping',
    category: 'General',
    description: 'Professional Freezer-MD system and latency diagnostic',
    aliases: ['pong', 'latency'],
    tags: ['main', 'system'],
    command: /^\.?(ping|pong|latency)$/i,
    filename: __filename
}, async (sock, m) => {

    const startedAt = process.hrtime.bigint();

    try {

        const botName = '❄️ FREEZER-MD ❄️';
        const prefix = global.BOT_PREFIX || '.';

        if (!sock) {
            throw new Error('WhatsApp connection is unavailable.');
        }

        if (!m) {
            throw new Error('Message context is unavailable.');
        }

        // ─────────────────────────────────────
        // RESPONSE LATENCY
        // ─────────────────────────────────────

        const responseTime =
            Number(process.hrtime.bigint() - startedAt) / 1e6;

        const latency = Number(responseTime.toFixed(2));

        // ─────────────────────────────────────
        // CONNECTION STATUS
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
        // SYSTEM INFORMATION
        // ─────────────────────────────────────

        const memory = process.memoryUsage();

        const ramUsed =
            (memory.rss / 1024 / 1024).toFixed(1);

        const heapUsed =
            (memory.heapUsed / 1024 / 1024).toFixed(1);

        const heapTotal =
            (memory.heapTotal / 1024 / 1024).toFixed(1);

        const cpuLoad =
            os.loadavg ? os.loadavg()[0].toFixed(2) : 'N/A';

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeText =
            `${hours}h ${minutes}m ${seconds}s`;

        // ─────────────────────────────────────
        // PERFORMANCE ENGINE
        // ─────────────────────────────────────

        let performance;
        let status;

        if (latency <= 100) {
            performance = 'EXCELLENT ⚡';
            status = 'OPTIMAL 🟢';
        } else if (latency <= 300) {
            performance = 'FAST 🚀';
            status = 'HEALTHY 🟢';
        } else if (latency <= 700) {
            performance = 'STABLE 🟡';
            status = 'STABLE 🟡';
        } else {
            performance = 'HIGH LATENCY 🔴';
            status = 'SLOW 🔴';
        }

        // ─────────────────────────────────────
        // FREEZER-MD PRO PING
        // ─────────────────────────────────────

        const pingText = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     ${botName}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━〔 ⚡ PRO PING 〕━━━┓
┃
┃ 🏓 *PONG!*
┃
┃ 📡 RESPONSE
┃ └─ *${latency}ms*
┃
┃ 🟢 CONNECTION
┃ └─ *${connection}*
┃
┃ 🚀 PERFORMANCE
┃ └─ *${performance}*
┃
┃ 📊 SYSTEM STATUS
┃ └─ *${status}*
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━〔 🖥️ SYSTEM 〕━━━┓
┃
┃ 💾 RAM: *${ramUsed} MB*
┃ 🧠 HEAP: *${heapUsed}/${heapTotal} MB*
┃ ⚙️ CPU LOAD: *${cpuLoad}*
┃ ⏱️ UPTIME: *${uptimeText}*
┃ 🔧 PREFIX: *${prefix}*
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

╭──────────────────────────╮
│ ❄️ *FREEZER-MD*
│ 💪 *PRO SYSTEM MONITOR*
╰──────────────────────────╯
`.trim();

        await sendInteractiveMessage(sock, m.from, {
            title: '❄️ FREEZER-MD • PRO PING',
            text: pingText,
            footer: '❄️ Freezer-MD • Fast • Stable • Powerful',
            interactiveButtons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '❄️ View Channel',
                        url: 'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                    })
                }
            ]
        });

    } catch (error) {

        console.error(
            '[FREEZER-MD] Pro Ping Error:',
            error
        );

        try {

            await m.reply(`
╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔴 *SYSTEM CHECK FAILED*
┃
┃ ${String(error?.message || 'Unable to complete diagnostics.').substring(0, 150)}
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
