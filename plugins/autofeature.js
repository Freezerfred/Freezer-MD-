'use strict';

const { cmd } = require('../arslan');
const autoFeatures = require('../lib/autoFeatures');

cmd({
    pattern: 'autofeature',
    name: 'autofeature',
    category: 'Admin',
    aliases: ['af', 'autof'],
    description: 'Manage Freezer-MD automatic features',
    filename: __filename
}, async (sock, m, args) => {

    // Owner protection
    if (!global.owners || !global.owners.includes(m.sender)) {
        return m.reply('❌ This command is owner only.');
    }

    const sub = (args[0] || '').toLowerCase();
    const value = (args[1] || '').toLowerCase();

    const status = autoFeatures.getStatus();

    // =========================
    // MAIN STATUS
    // =========================
    if (!sub) {
        return m.reply(
`🥶 *FREEZER-MD AUTO FEATURES*

╭───────────────╮
│ ⚙️ AUTO FEATURES
╰───────────────╯

📖 Auto Read    : ${status.autoRead ? '🟢 ON' : '🔴 OFF'}
👁️ Auto View    : ${status.autoView ? '🟢 ON' : '🔴 OFF'}
❤️ Auto Like    : ${status.autoLike ? '🟢 ON' : '🔴 OFF'}
🟢 Presence     : ${status.presenceMode.toUpperCase()}

╭───────────────╮
│ 📚 COMMANDS
╰───────────────╯

• .autofeature read on
• .autofeature read off

• .autofeature view on
• .autofeature view off

• .autofeature like on
• .autofeature like off

• .autofeature presence online
• .autofeature presence typing
• .autofeature presence recording
• .autofeature presence none

🥶 *FREEZER-MD*`
        );
    }

    // =========================
    // ON / OFF FEATURES
    // =========================
    if (['read', 'view', 'like'].includes(sub)) {

        if (!['on', 'off'].includes(value)) {
            return m.reply(
`❌ Invalid option.

Usage:
.autofeature ${sub} on
.autofeature ${sub} off

Current: ${status[`auto${sub.charAt(0).toUpperCase() + sub.slice(1)}`] ? 'ON' : 'OFF'}`
            );
        }

        const enabled = value === 'on';

        if (sub === 'read') {
            autoFeatures.set('autoRead', enabled);
        }

        if (sub === 'view') {
            autoFeatures.set('autoView', enabled);
        }

        if (sub === 'like') {
            autoFeatures.set('autoLike', enabled);
        }

        return m.reply(
`🥶 *FREEZER-MD AUTO FEATURE*

⚙️ Feature : ${sub.toUpperCase()}
📡 Status  : ${enabled ? '🟢 ENABLED' : '🔴 DISABLED'}

Settings saved successfully.`
        );
    }

    // =========================
    // PRESENCE
    // =========================
    if (sub === 'presence') {

        const modes = [
            'none',
            'online',
            'typing',
            'recording'
        ];

        if (!modes.includes(value)) {
            return m.reply(
`❌ Invalid presence mode.

Available modes:

• none
• online
• typing
• recording

Example:
.autofeature presence typing`
            );
        }

        autoFeatures.set('presenceMode', value);

        return m.reply(
`🥶 *FREEZER-MD PRESENCE*

🟢 Presence mode:
*${value.toUpperCase()}*

💾 Setting saved successfully.`
        );
    }

    // =========================
    // RESET
    // =========================
    if (sub === 'reset') {

        autoFeatures.reset();

        return m.reply(
`🥶 *FREEZER-MD AUTO FEATURES*

♻️ All automatic features have been reset.

📖 Auto Read : OFF
👁️ Auto View : OFF
❤️ Auto Like : OFF
🟢 Presence  : NONE`
        );
    }

    return m.reply(
`❌ Unknown option.

Use:
.autofeature

or

.autofeature read on/off
.autofeature view on/off
.autofeature like on/off
.autofeature presence none/online/typing/recording
.autofeature reset`
    );
});
