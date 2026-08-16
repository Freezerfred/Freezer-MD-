Const axios = require('axios');

const { cmd } = require('../arslan');

cmd({
    pattern: "menu",
    name: 'menu',
    hidden: true,
    description: 'Show available bot commands',
    aliases: ['help', 'cmdlist', 'commands'],
    filename: __filename
}, async (sock, m) => {    
    const prefix = global.BOT_PREFIX || '.';    
    
    const now = new Date();
    
    const date = now.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'Africa/Accra'
    });
    
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true,
        timeZone: 'Africa/Accra'
    });
    
    const botOwner = global.ownerName || 'FREEZER MD';
    
    const user = m.pushName || m.sender?.split('@')[0] || 'User';

    const uptimeSec = process.uptime();
    const uh = Math.floor(uptimeSec / 3600);
    const um = Math.floor((uptimeSec % 3600) / 60);
    const us = Math.floor(uptimeSec % 60);
    const uptimeStr = `${uh}h ${um}m ${us}s`;

    const ramStr = `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`;

    // ❄️ STYLISH BORDERS & UNICODE BOLD MAPPING
    const TOP = `╔════════════════╗`;
    const MID = `╠════════════════╣`;
    const BOT = `╚════════════════╝`;

    // Function to convert normal text to Unicode Serif Bold
    const toBold = (text) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const bold = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
        return text.split('').map(char => {
            const index = normal.indexOf(char);
            return index !== -1 ? bold[index * 2] + bold[index * 2 + 1] : char;
        }).join('');
    };

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
        Tools: '🔧',
        AI: '🤖',
        Fun: '🎮',
        Group: '👥',
        Status: '📡',
        Channel: '📢',
        Admin: '👑'
    };

    const grouped = {};
    const seen = new Set();
    let totalPlugins = 0;

    if (global.plugins instanceof Map) {
        const uniquePlugins = new Set(global.plugins.values());
        totalPlugins = uniquePlugins.size;

        for (const plugin of global.plugins.values()) {
            if (!plugin || !plugin.name) continue;
            if (plugin.hidden) continue;
            if (seen.has(plugin.name)) continue;

            seen.add(plugin.name);

            const category = plugin.category || 'General';

            if (!grouped[category]) grouped[category] = [];

            grouped[category].push(`${prefix}${plugin.name}`);
        }
    }

    const allCategories = [
        ...CATEGORY_ORDER.filter(c => grouped[c]),
        ...Object.keys(grouped).filter(
            c => !CATEGORY_ORDER.includes(c)
        )
    ];

    const commandSections = allCategories.map(category => {
        const icon = CATEGORY_ICONS[category] || '📂';

        const lines = grouped[category]
            .map(l => `║ ❄️ ${toBold(l)}`)
            .join('\n');

        return `${TOP}
║ ${icon} ${toBold(category.toUpperCase() + ' COMMANDS')}
${MID}
║
${lines}
║
${BOT}`;
    }).join('\n\n');

    const menuText = `
${TOP}
║       ❄️ ${toBold('FREEZER MD')} ❄️
║   ${toBold('ADVANCED WHATSAPP BOT')}
${MID}
║
║ 👑 ${toBold('OWNER:')} ${toBold(botOwner)}
║ 👤 ${toBold('USER:')} ${toBold(user)}
║ ⚡ ${toBold('PLUGINS:')} ${toBold(String(totalPlugins))}
║ 🚀 ${toBold('UPTIME:')} ${toBold(uptimeStr)}
║ 📅 ${toBold('DATE:')} ${toBold(date)}
║ ⏰ ${toBold('TIME:')} ${toBold(time)}
║ 💾 ${toBold('RAM:')} ${toBold(ramStr)}
║ ⚙️ ${toBold('PREFIX:')} [ ${toBold(prefix)} ]
║
${BOT}

${commandSections}

❄️ ${toBold('FREEZER MD')}
> ${toBold('POWERED BY ADVANCED TECHNOLOGY')}
`.trim();

    try {    
        if (!global.menuImage) {
            throw new Error('global.menuImage is not set');
        }

        const imageBuffer = (await axios.get(global.menuImage, {
            responseType: 'arraybuffer',
            timeout: 8000
        })).data;    
        
        await m.reply(imageBuffer, { 
            caption: menuText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426778975572@newsletter',
                    newsletterName: '❄️ FREEZER MD ❄️',
                    serverMessageId: 1
                }
            }
        });
        
    } catch (err) {    
        console.error(
            'Menu image error, falling back to text:',
            err.message
        );

        try {
            await m.reply(menuText);
        } catch (err2) {
            console.error(
                'Menu fallback error:',
                err2.message
            );
        }
    }    
});
