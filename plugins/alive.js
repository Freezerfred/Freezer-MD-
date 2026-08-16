'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: "alive",
    name: 'alive',
    category: 'General',
    description: 'Check Freezer-MD system status',
    aliases: ['status', 'botstatus'],
    tags: ['main', 'status'],
    command: /^\.?(alive|status|botstatus)$/i,
    filename: __filename
}, async (sock, m) => {

    try {
        // ─────────────────────────────────────
        // FREEZER-MD SYSTEM INFORMATION
        // ─────────────────────────────────────

        const prefix = global.BOT_PREFIX || '.';
        const owner = global.ownerName || '🥶 Freezer 🥶';
        const botName = '❄️ FREEZER-MD ❄️';

        // Uptime
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

        // Memory
        const memory = process.memoryUsage();
        const ram = `${(memory.rss / 1024 / 1024).toFixed(2)} MB`;

        // Plugins
        let pluginCount = 0;

        if (global.plugins instanceof Map) {
            const uniquePlugins = new Set();

            for (const plugin of global.plugins.values()) {
                if (plugin && typeof plugin === 'object') {
                    uniquePlugins.add(plugin);
                }
            }

            pluginCount = uniquePlugins.size;
        }

        // Node version
        const nodeVersion = process.version;

        // Platform
        const platform = process.platform;

        // Response time
        const start = Date.now();

        // ─────────────────────────────────────
        // ALIVE MESSAGE
        // ─────────────────────────────────────

        const aliveText = `
╭━━━〔 ${botName} 〕━━━╮
┃
┃ 🟢 *SYSTEM ONLINE*
┃
┃ ⚡ *RESPONSE*
┃ └─ ${Date.now() - start}ms
┃
┃ 🚀 *UPTIME*
┃ └─ ${uptime}
┃
┃ 💾 *MEMORY*
┃ └─ ${ram}
┃
┃ 🧩 *PLUGINS*
┃ └─ ${pluginCount}
┃
┃ 👑 *OWNER*
┃ └─ ${owner}
┃
┃ 🟦 *NODE.JS*
┃ └─ ${nodeVersion}
┃
┃ 📱 *PLATFORM*
┃ └─ ${platform}
┃
┃ ⚙️ *PREFIX*
┃ └─ ${prefix}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❄️ *FREEZER-MD*
> *POWERED BY ADVANCED TECHNOLOGY*
`.trim();

        // ─────────────────────────────────────
        // SEND RESPONSE
        // ─────────────────────────────────────

        await m.reply(aliveText);

    } catch (err) {

        console.error('[FREEZER-MD] Alive Error:', err);

        // Safe fallback — never crash the command
        try {
            await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *SYSTEM CHECK FAILED*
┃
┃ ${err?.message || 'Unknown system error'}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
            );
        } catch (fallbackError) {
            console.error(
                '[FREEZER-MD] Alive fallback error:',
                fallbackError
            );
        }
    }
});
