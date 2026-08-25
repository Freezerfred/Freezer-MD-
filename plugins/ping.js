'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'ping',
    name: 'ping',
    category: 'General',
    description: 'Measure Freezer-MD response speed',
    aliases: ['pong', 'latency'],
    filename: __filename
}, async (sock, m) => {

    try {

        // ─────────────────────────────────────────────
        // REAL RESPONSE MEASUREMENT
        // ─────────────────────────────────────────────

        const start = process.hrtime.bigint();

        const response = await sock.sendMessage(m.from, {
            text: '❄️ *FREEZER-MD* • Checking response...'
        });

        const end = process.hrtime.bigint();

        const ms = Math.max(
            1,
            Math.round(
                Number(end - start) / 1_000_000
            )
        );

        // ─────────────────────────────────────────────
        // RESPONSE STATUS
        // ─────────────────────────────────────────────

        const status =
            ms <= 150 ? '⚡ Excellent' :
            ms <= 400 ? '🚀 Fast' :
            ms <= 800 ? '🟢 Stable' :
            '🟡 Slow';

        // ─────────────────────────────────────────────
        // FREEZER-MD DESIGN
        // ─────────────────────────────────────────────

        const TOP =
            '╭━━━━━━━━━━━━━━━━━━━━❄️';

        const MID =
            '┣━━━━━━━━━━━━━━━━━━━━❄️';

        const BOT =
            '╰━━━━━━━━━━━━━━━━━━━━❄️';

        const pingText =
`${TOP}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃
${MID}
┃ 🏓 *Pong:* ${ms}ms
┃ 📡 *Status:* ${status}
┃
${BOT}

❄️ *FAST • STABLE • POWERFUL*
> *BUILT DIFFERENT.*`;

        // ─────────────────────────────────────────────
        // EDIT ORIGINAL MESSAGE
        // ─────────────────────────────────────────────

        try {

            await sock.sendMessage(
                m.from,
                {
                    text: pingText,
                    edit: response.key
                }
            );

        } catch (editError) {

            // Fallback if message editing isn't supported
            await m.reply(pingText);
        }

    } catch (error) {

        console.error(
            '[FREEZER-MD] Ping Error:',
            error
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━❄️
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃
┃ ❌ *Ping failed*
┃
┃ ${error?.message || 'Unknown error'}
┃
╰━━━━━━━━━━━━━━━━━━━━❄️`
        );
    }
});
