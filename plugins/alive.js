'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'alive',
    name: 'alive',
    category: 'General',
    description: 'Check Freezer-MD system status',
    aliases: ['status', 'botstatus'],
    tags: ['main', 'status'],
    command: /^\.?(alive|status|botstatus)$/i,
    filename: __filename
}, async (sock, m) => {

    try {

        const prefix = global.BOT_PREFIX || '.';
        const owner = global.ownerName || 'Freezer';

        // ─────────────────────────────────────
        // UPTIME
        // ─────────────────────────────────────

        const uptimeSec = Math.floor(process.uptime());

        const days = Math.floor(uptimeSec / 86400);
        const hours = Math.floor((uptimeSec % 86400) / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = uptimeSec % 60;

        const uptime = [
            days ? `${days}d` : '',
            hours ? `${hours}h` : '',
            minutes ? `${minutes}m` : '',
            `${seconds}s`
        ].filter(Boolean).join(' ');

        // ─────────────────────────────────────
        // MEMORY
        // ─────────────────────────────────────

        const memory = process.memoryUsage();
        const ram =
            `${(memory.rss / 1024 / 1024).toFixed(1)} MB`;

        // ─────────────────────────────────────
        // PLUGINS
        // ─────────────────────────────────────

        let pluginCount = 0;

        if (global.plugins instanceof Map) {

            pluginCount =
                new Set(
                    [...global.plugins.values()]
                        .filter(Boolean)
                ).size;
        }

        // ─────────────────────────────────────
        // REAL RESPONSE TEST
        // ─────────────────────────────────────

        const start = process.hrtime.bigint();

        const sent = await sock.sendMessage(
            m.from,
            {
                text: '❄️ *FREEZER-MD*'
            }
        );

        const end = process.hrtime.bigint();

        const response =
            Math.max(
                1,
                Math.round(
                    Number(end - start) / 1_000_000
                )
            );

        // ─────────────────────────────────────
        // STATUS
        // ─────────────────────────────────────

        const status =
            response <= 150
                ? '⚡ Excellent'
                : response <= 400
                    ? '🚀 Fast'
                    : response <= 800
                        ? '🟢 Stable'
                        : '🟡 Slow';

        // ─────────────────────────────────────
        // EDIT TEST MESSAGE
        // ─────────────────────────────────────

        const aliveText = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🟢 *ONLINE*
┃ ⚡ *Response:* ${response}ms
┃ 📡 *Status:* ${status}
┃ 🚀 *Uptime:* ${uptime}
┃ 💾 *RAM:* ${ram}
┃ 🧩 *Plugins:* ${pluginCount}
┃ 🔧 *Prefix:* ${prefix}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

❄️ *FREEZER-MD*
> *FAST • STABLE • POWERFUL*
`.trim();

        try {

            await sock.sendMessage(
                m.from,
                {
                    text: aliveText,
                    edit: sent.key
                }
            );

        } catch {

            // If message editing isn't supported,
            // send the final result normally.
            await m.reply(aliveText);
        }

    } catch (err) {

        console.error(
            '[FREEZER-MD] Alive Error:',
            err
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔴 *SYSTEM CHECK FAILED*
┃
┃ ${err?.message || 'Unable to check system status.'}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
