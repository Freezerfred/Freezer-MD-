'use strict';

const axios = require('axios');
const fs = require('fs');

const { cmd } = require('../arslan');

cmd({
    pattern: 'menu',
    name: 'menu',
    hidden: true,
    description: 'Show available Freezer-MD commands',
    aliases: ['help', 'cmdlist', 'commands'],
    filename: __filename
}, async (sock, m) => {

    const prefix = global.BOT_PREFIX || '.';

    // ─────────────────────────────────────────────
    // DATE & TIME
    // ─────────────────────────────────────────────

    const now = new Date();

    const date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Africa/Nairobi'
    });

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Africa/Nairobi'
    });

    // ─────────────────────────────────────────────
    // BOT INFORMATION
    // ─────────────────────────────────────────────

    const botOwner =
        global.ownerName || 'Freezer';

    const user =
        m.pushName ||
        m.sender?.split('@')[0] ||
        'User';

    const uptimeSec = process.uptime();

    const hours =
        Math.floor(uptimeSec / 3600);

    const minutes =
        Math.floor((uptimeSec % 3600) / 60);

    const seconds =
        Math.floor(uptimeSec % 60);

    const uptimeStr =
        `${hours}h ${minutes}m ${seconds}s`;

    const ramStr =
        `${(
            process.memoryUsage().rss /
            1024 /
            1024
        ).toFixed(2)} MB`;

    // ─────────────────────────────────────────────
    // FREEZER-MD DESIGN
    // ─────────────────────────────────────────────

    const TOP =
        '╭──────────────────────╮';

    const MID =
        '├──────────────────────┤';

    const BOT =
        '╰──────────────────────╯';

    // ─────────────────────────────────────────────
    // CATEGORIES
    // ─────────────────────────────────────────────

    const CATEGORY_ORDER = [
        'General',
        'Downloaders',
        'Tools',
        'AI',
        'Fun',
        'Group',
        'Status',
        'Channel',
        'Admin'
    ];

    const CATEGORY_ICONS = {
        General: '⚡',
        Downloaders: '📥',
        Tools: '🛠️',
        AI: '🧠',
        Fun: '🎮',
        Group: '👥',
        Status: '📡',
        Channel: '📢',
        Admin: '👑'
    };

    // ─────────────────────────────────────────────
    // LOAD PLUGINS
    // ─────────────────────────────────────────────

    const grouped = {};
    const seen = new Set();

    let totalPlugins = 0;

    if (global.plugins instanceof Map) {

        const uniquePlugins =
            new Set(global.plugins.values());

        for (const plugin of uniquePlugins) {

            if (!plugin || typeof plugin !== 'object') {
                continue;
            }

            if (!plugin.name) {
                continue;
            }

            if (plugin.hidden) {
                continue;
            }

            const commandName =
                String(plugin.name)
                    .trim()
                    .toLowerCase();

            if (!commandName) {
                continue;
            }

            if (seen.has(commandName)) {
                continue;
            }

            seen.add(commandName);

            let category =
                String(
                    plugin.category || 'General'
                ).trim();

            const matchedCategory =
                CATEGORY_ORDER.find(
                    item =>
                        item.toLowerCase() ===
                        category.toLowerCase()
                );

            category =
                matchedCategory || category;

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(
                `${prefix}${commandName}`
            );

            totalPlugins++;
        }
    }

    // ─────────────────────────────────────────────
    // CATEGORY COUNT
    // ─────────────────────────────────────────────

    const categoryCount =
        Object.keys(grouped).length;

    // ─────────────────────────────────────────────
    // BUILD CATEGORIES
    // ─────────────────────────────────────────────

    const allCategories = [
        ...CATEGORY_ORDER.filter(
            category =>
                grouped[category] &&
                grouped[category].length > 0
        ),

        ...Object.keys(grouped).filter(
            category =>
                !CATEGORY_ORDER.includes(category) &&
                grouped[category]?.length > 0
        )
    ];

    const commandSections =
        allCategories.map(category => {

            const icon =
                CATEGORY_ICONS[category] || '📂';

            const commands =
                grouped[category]
                    .sort((a, b) =>
                        a.localeCompare(
                            b,
                            undefined,
                            {
                                sensitivity: 'base'
                            }
                        )
                    )
                    .map(command =>
                        `│  ${command}`
                    )
                    .join('\n');

            return `
┌─ ${icon} *${category.toUpperCase()}*
${commands}
└──────────────────────`;

        }).join('\n');

    // ─────────────────────────────────────────────
    // PREMIUM MENU
    // ─────────────────────────────────────────────

    const menuText = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗* ❄️
┃     *MULTI DEVICE*
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 👤 *PROFILE* 〕
│
│  👑 Owner   : ${botOwner}
│  👤 User    : ${user}
│  🔧 Prefix  : ${prefix}
│
╰──────────────────────

╭─〔 ⚙️ *SYSTEM STATUS* 〕
│
│  🟢 Status   : ONLINE
│  ⚡ Uptime   : ${uptimeStr}
│  💾 Memory   : ${ramStr}
│  📅 Date     : ${date}
│  🕐 Time     : ${time}
│
╰──────────────────────

╭─〔 📊 *BOT OVERVIEW* 〕
│
│  🧩 Commands : ${totalPlugins}
│  📂 Categories: ${categoryCount}
│  📡 Platform  : WhatsApp
│  🚀 Engine    : Freezer-MD
│
╰──────────────────────

${commandSections}

╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┃
┃ ⚡ Fast   •   Stable
┃ 🛡️ Secure •   Powerful
┃
┃ *BUILT DIFFERENT.*
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    // ─────────────────────────────────────────────
    // MENU IMAGE
    // ─────────────────────────────────────────────

    try {

        if (!global.menuImage) {
            throw new Error(
                'global.menuImage is not configured'
            );
        }

        let imageBuffer;

        if (
            typeof global.menuImage === 'string' &&
            /^https?:\/\//i.test(global.menuImage)
        ) {

            const response =
                await axios.get(
                    global.menuImage,
                    {
                        responseType: 'arraybuffer',
                        timeout: 10000,
                        maxContentLength:
                            10 * 1024 * 1024,
                        maxBodyLength:
                            10 * 1024 * 1024
                    }
                );

            imageBuffer =
                Buffer.from(response.data);

        } else {

            if (
                typeof global.menuImage !== 'string' ||
                !fs.existsSync(global.menuImage)
            ) {
                throw new Error(
                    'Menu image file not found'
                );
            }

            imageBuffer =
                fs.readFileSync(
                    global.menuImage
                );
        }

        // ─────────────────────────────────────────
        // SEND PREMIUM MENU
        // ─────────────────────────────────────────

        await m.reply(
            imageBuffer,
            {
                caption: menuText
            }
        );

    } catch (error) {

        console.error(
            '❄️ Freezer-MD Menu Error:',
            error.message
        );

        // Text fallback
        try {

            await m.reply(
                menuText
            );

        } catch (fallbackError) {

            console.error(
                '❄️ Freezer-MD Menu Fallback Error:',
                fallbackError.message
            );
        }
    }
});
