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

    try {

        // =====================================================
        // PREFIX
        // =====================================================

        const prefix =
            global.BOT_PREFIX || '.';

        // =====================================================
        // DATE & TIME — NAIROBI
        // =====================================================

        const now = new Date();

        const date =
            now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'Africa/Nairobi'
            });

        const time =
            now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Africa/Nairobi'
            });

        // =====================================================
        // BOT INFORMATION
        // =====================================================

        const botName =
            global.BOT_NAME ||
            'FREEZER-MD';

        const botOwner =
            global.ownerName ||
            '🥶 Freezer 🥶';

        const user =
            m.pushName ||
            m.sender?.split('@')[0] ||
            'User';

        // =====================================================
        // UPTIME
        // =====================================================

        const uptimeSec =
            Math.floor(process.uptime());

        const days =
            Math.floor(
                uptimeSec / 86400
            );

        const hours =
            Math.floor(
                (uptimeSec % 86400) / 3600
            );

        const minutes =
            Math.floor(
                (uptimeSec % 3600) / 60
            );

        const seconds =
            uptimeSec % 60;

        const uptimeParts = [];

        if (days) {
            uptimeParts.push(
                `${days}d`
            );
        }

        if (hours) {
            uptimeParts.push(
                `${hours}h`
            );
        }

        if (minutes) {
            uptimeParts.push(
                `${minutes}m`
            );
        }

        uptimeParts.push(
            `${seconds}s`
        );

        const uptimeStr =
            uptimeParts.join(' ');

        // =====================================================
        // RAM
        // =====================================================

        const ramStr =
            `${(
                process.memoryUsage().rss /
                1024 /
                1024
            ).toFixed(2)}MB`;

        // =====================================================
        // HEAVY WHATSAPP BOX
        // =====================================================

        const TOP =
            '╔══════════════════════╗';

        const MID =
            '╠══════════════════════╣';

        const BOTTOM =
            '╚══════════════════════╝';

        // =====================================================
        // CATEGORY ORDER
        // =====================================================

        const CATEGORY_ORDER = [
            'General',
            'Downloaders',
            'Tools',
            'AI',
            'Fun',
            'Group',
            'Status',
            'Channel',
            'Admin',
            'Owner',
            'Security'
        ];

        // =====================================================
        // CATEGORY EMOJIS
        // =====================================================

        const CATEGORY_ICONS = {

            General: '⚡',

            Downloaders: '📥',

            Tools: '🛠️',

            AI: '🤖',

            Fun: '🎮',

            Group: '👥',

            Status: '📡',

            Channel: '📢',

            Admin: '👑',

            Owner: '🔐',

            Security: '🛡️'
        };

        // =====================================================
        // COMMAND EMOJIS
        // =====================================================

        const COMMAND_ICONS = {

            // General
            creator: '👤',
            alive: '💚',
            menu: '📋',
            ping: '📡',
            uptime: '⏱️',
            freezer: '🥶',
            repo: '🔗',

            // Downloaders
            igdl: '📸',
            fbdl: '📘',
            play: '▶️',
            tiktok: '🎵',
            video: '🎬',
            ytsearch: '🔎',
            ytmp3: '🎧',
            ytmp4: '🎬',

            // Tools
            compress: '🗜️',
            img: '🖼️',
            ocr: '🔤',
            poll: '📊',
            profilepic: '👤',
            retag: '🏷️',
            sv: '🔗',
            shazam: '🎵',
            sticker: '🧩',
            textpro: '📝',
            toaudio: '🎧',
            tourl: '🌐',
            tts: '🗣️',
            viewonce: '👁️',

            // AI
            ai: '🧠',
            chat: '💬',
            ask: '❓',
            imagine: '🎨',
            image: '🖼️',
            write: '✍️',

            // Fun
            joke: '😂',
            meme: '🤣',
            quote: '💭',
            truth: '🎭',
            dare: '🔥',
            fact: '🧠',

            // Group
            add: '➕',
            kick: '🚫',
            promote: '⬆️',
            demote: '⬇️',
            mute: '🔇',
            unmute: '🔊',
            tagall: '📢',
            hidetag: '🙈',
            welcome: '👋',
            goodbye: '👋',
            groupinfo: '👥',

            // Status
            status: '🟢',
            autoview: '👁️',
            autoreact: '❤️',
            autolike: '👍',

            // Channel
            channel: '📢',
            follow: '➕',
            unfollow: '➖',

            // Admin
            settings: '⚙️',
            manage: '🔧',
            announce: '📣',

            // Owner
            eval: '💻',
            exec: '⚙️',
            restart: '🔄',
            shutdown: '⛔',
            update: '🔄',
            reload: '♻️',
            broadcast: '📡',

            // Security
            antidelete: '🗑️',
            protect: '🛡️',
            privacy: '🔐'
        };

        // =====================================================
        // LOAD PLUGINS
        // =====================================================

        const grouped = {};
        const seen = new Set();

        let totalPlugins = 0;

        if (
            global.plugins instanceof Map
        ) {

            const uniquePlugins =
                new Set(
                    global.plugins.values()
                );

            for (
                const plugin
                of uniquePlugins
            ) {

                if (
                    !plugin ||
                    !plugin.name
                ) {
                    continue;
                }

                // Don't show hidden plugins
                if (plugin.hidden) {
                    continue;
                }

                const pluginName =
                    String(
                        plugin.name
                    ).trim();

                if (!pluginName) {
                    continue;
                }

                const uniqueName =
                    pluginName.toLowerCase();

                // Prevent duplicate commands
                if (
                    seen.has(uniqueName)
                ) {
                    continue;
                }

                seen.add(uniqueName);

                const category =
                    String(
                        plugin.category ||
                        'General'
                    ).trim();

                if (
                    !grouped[category]
                ) {
                    grouped[category] = [];
                }

                grouped[category].push(
                    pluginName
                );

                totalPlugins++;
            }
        }

        // =====================================================
        // ALL CATEGORIES
        // =====================================================

        const allCategories = [

            ...CATEGORY_ORDER.filter(
                category =>
                    grouped[category] &&
                    grouped[category].length
            ),

            ...Object.keys(grouped)
                .filter(
                    category =>
                        !CATEGORY_ORDER.includes(
                            category
                        ) &&
                        grouped[category]?.length
                )
        ];

        // =====================================================
        // BUILD CATEGORY SECTIONS
        // =====================================================

        const commandSections =
            allCategories
                .map(category => {

                    const categoryIcon =
                        CATEGORY_ICONS[
                            category
                        ] || '📂';

                    const commands =
                        grouped[category]
                            .sort(
                                (a, b) =>
                                    a.localeCompare(b)
                            )
                            .map(command => {

                                const commandKey =
                                    command
                                        .toLowerCase()
                                        .replace(
                                            /^\./,
                                            ''
                                        );

                                const emoji =
                                    COMMAND_ICONS[
                                        commandKey
                                    ] || '🔹';

                                return (
                                    `║ ${emoji} ${prefix}${command}`
                                );

                            })
                            .join('\n');

                    return `
${TOP}
║ ${categoryIcon} *${category.toUpperCase()}*
${MID}
${commands}
${BOTTOM}`;

                })
                .join('\n');

        // =====================================================
        // FINAL MENU
        // =====================================================

        const menuText = `
${TOP}
║ 🥶 *${botName}*
║ ✨ *MULTI-DEVICE*
${MID}
║ 👑 *OWNER:* ${botOwner}
║ 👤 *USER:* ${user}
║ 🧩 *PLUGINS:* ${totalPlugins}
║ ⚡ *UPTIME:* ${uptimeStr}
║ 📅 *DATE:* ${date}
║ 🕐 *TIME:* ${time}
║ 📊 *RAM:* ${ramStr}
║ 🔧 *PREFIX:* ${prefix}
${BOTTOM}

${commandSections}

${TOP}
║ 🥶 *${botName}*
${MID}
║ 🚀 *FAST • STABLE • POWERFUL*
║ 💠 *POWERED BY FREEZER*
║ ❄️ *BUILT DIFFERENT*
${BOTTOM}
`.trim();

        // =====================================================
        // SEND MENU
        // =====================================================

        if (
            !global.menuImage
        ) {

            return await m.reply(
                menuText
            );
        }

        let imageBuffer;

        // Remote image
        if (
            /^https?:\/\//i.test(
                global.menuImage
            )
        ) {

            const response =
                await axios.get(
                    global.menuImage,
                    {
                        responseType:
                            'arraybuffer',

                        timeout: 15000,

                        maxContentLength:
                            10 * 1024 * 1024,

                        maxBodyLength:
                            10 * 1024 * 1024
                    }
                );

            imageBuffer =
                Buffer.from(
                    response.data
                );

        }

        // Local image
        else {

            if (
                !fs.existsSync(
                    global.menuImage
                )
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

        // =====================================================
        // SEND IMAGE MENU
        // =====================================================

        await sock.sendMessage(
            m.from,
            {
                image: imageBuffer,
                caption: menuText
            },
            {
                quoted: m.key
            }
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Menu Error:',
            error
        );

        // Fallback to text menu
        try {

            await m.reply(
`❌ *FREEZER-MD MENU ERROR*

Unable to load the menu image.

${error.message}`
            );

        } catch (replyError) {

            console.error(
                '[FREEZER-MD] Menu Reply Error:',
                replyError
            );
        }
    }
});
