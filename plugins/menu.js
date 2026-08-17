'use strict';

const axios = require('axios');
const { sendInteractiveMessage } = require('gifted-btns');

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
    // FREEZER-MD CHANNEL
    // ─────────────────────────────────────────────

    const CHANNEL_URL =
        'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

    // ─────────────────────────────────────────────
    // DATE & TIME
    // ─────────────────────────────────────────────

    const now = new Date();

    const date = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
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
        global.ownerName || '🥶 FREEZER';

    const user =
        m.pushName ||
        m.sender?.split('@')[0] ||
        'User';

    const uptimeSec = process.uptime();

    const uh =
        Math.floor(uptimeSec / 3600);

    const um =
        Math.floor((uptimeSec % 3600) / 60);

    const us =
        Math.floor(uptimeSec % 60);

    const uptimeStr =
        `${uh}h ${um}m ${us}s`;

    const ramStr =
        `${(
            process.memoryUsage().rss /
            1024 /
            1024
        ).toFixed(2)}MB`;

    // ─────────────────────────────────────────────
    // FREEZER-MD DESIGN
    // ─────────────────────────────────────────────

    const CAP = '❄️';

    const TOP =
        `╭──═════════════${CAP}`;

    const MID =
        `╠──═════════════${CAP}`;

    const BOT =
        `╰──═════════════${CAP}`;

    // ─────────────────────────────────────────────
    // COMMAND CATEGORIES
    // ─────────────────────────────────────────────

    const CATEGORY_ORDER = [
        'General',
        'Downloaders',
        'Tools',
        'AI',
        'Media',
        'Fun',
        'Group',
        'Security',
        'Status',
        'Channel',
        'Admin',
        'Owner'
    ];

    const CATEGORY_ICONS = {
        General: '⚡',
        Downloaders: '📥',
        Tools: '🛠️',
        AI: '🧠',
        Media: '🎨',
        Fun: '🎉',
        Group: '👥',
        Security: '🛡️',
        Status: '📡',
        Channel: '📢',
        Admin: '👑',
        Owner: '🔐'
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

        totalPlugins =
            uniquePlugins.size;

        for (const plugin of uniquePlugins) {

            if (!plugin || !plugin.name) {
                continue;
            }

            if (plugin.hidden) {
                continue;
            }

            if (seen.has(plugin.name)) {
                continue;
            }

            seen.add(plugin.name);

            const category =
                plugin.category || 'General';

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(
                `${prefix}${plugin.name}`
            );
        }
    }

    // ─────────────────────────────────────────────
    // CATEGORY ORDER
    // ─────────────────────────────────────────────

    const allCategories = [
        ...CATEGORY_ORDER.filter(
            category => grouped[category]
        ),

        ...Object.keys(grouped).filter(
            category =>
                !CATEGORY_ORDER.includes(category)
        )
    ];

    // ─────────────────────────────────────────────
    // BUILD MENU SECTIONS
    // ─────────────────────────────────────────────

    const commandSections =
        allCategories.map(category => {

            const icon =
                CATEGORY_ICONS[category] ||
                '📂';

            const lines =
                grouped[category]
                    .sort((a, b) =>
                        a.localeCompare(b)
                    )
                    .map(command =>
                        `║ ❄️ ${command}`
                    )
                    .join('\n');

            return `${TOP}
║ ${icon} *${category.toUpperCase()}*
${MID}
║
${lines}
║
${BOT}`;

        }).join('\n\n');

    // ─────────────────────────────────────────────
    // FREEZER-MD MENU
    // ─────────────────────────────────────────────

    const menuText = `
${TOP}
║
║ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗* ❄️
║
║ *𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗕𝗢𝗧*
${MID}
║
║ 👑 𝗢𝗪𝗡𝗘𝗥: ${botOwner}
║ 🙋 𝗨𝗦𝗘𝗥: ${user}
║ 🧩 𝗣𝗟𝗨𝗚𝗜𝗡𝗦: ${totalPlugins}
║ 🚀 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptimeStr}
║ 📆 𝗗𝗔𝗧𝗘: ${date}
║ 🕐 𝗧𝗜𝗠𝗘: ${time}
║ 📊 𝗥𝗔𝗠: ${ramStr}
║ 🔧 𝗣𝗥𝗘𝗙𝗜𝗫: ${prefix}
║
${BOT}

${commandSections}

${TOP}
║
║ 📢 *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟*
║
║ 🔗 *Tap the button below*
║
${BOT}

❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗙𝗥𝗘𝗘𝗭𝗘𝗥*
> *𝗕𝗨𝗜𝗟𝗧 𝗗𝗜𝗙𝗙𝗘𝗥𝗘𝗡𝗧.*
`.trim();

    // ─────────────────────────────────────────────
    // SEND MENU IMAGE
    // ─────────────────────────────────────────────

    try {

        if (!global.menuImage) {
            throw new Error(
                'global.menuImage is not set'
            );
        }

        const imageBuffer =
            (
                await axios.get(
                    global.menuImage,
                    {
                        responseType:
                            'arraybuffer',
                        timeout: 8000
                    }
                )
            ).data;

        await m.reply(
            imageBuffer,
            {
                caption: menuText
            }
        );

        // ─────────────────────────────────────────
        // VIEW CHANNEL BUTTON
        // ─────────────────────────────────────────

        await sendInteractiveMessage(
            sock,
            m.from,
            {
                title: '❄️ FREEZER-MD',
                text:
                    'Stay updated with the latest Freezer-MD releases, features and updates.',
                footer:
                    'FREEZER-MD • BUILT DIFFERENT ❄️',

                interactiveButtons: [
                    {
                        name: 'cta_url',

                        buttonParamsJson:
                            JSON.stringify({
                                display_text:
                                    '📢 View Channel',

                                url:
                                    CHANNEL_URL
                            })
                    }
                ]
            }
        );

    } catch (err) {

        console.error(
            '❌ Freezer-MD menu error:',
            err.message
        );

        // ─────────────────────────────────────────
        // TEXT FALLBACK
        // ─────────────────────────────────────────

        try {

            await m.reply(menuText);

            await sendInteractiveMessage(
                sock,
                m.from,
                {
                    title: '❄️ FREEZER-MD',
                    text:
                        'Join the official Freezer-MD channel for updates.',
                    footer:
                        'FREEZER-MD',

                    interactiveButtons: [
                        {
                            name: 'cta_url',

                            buttonParamsJson:
                                JSON.stringify({
                                    display_text:
                                        '📢 View Channel',

                                    url:
                                        CHANNEL_URL
                                })
                        }
                    ]
                }
            );

        } catch (err2) {

            console.error(
                '❌ Freezer-MD menu fallback error:',
                err2.message
            );
        }
    }
});
