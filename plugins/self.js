'use strict';

const { cmd } = require('../arslan');

let selfMode = false;

const registered = cmd({
    pattern: "self",
    name: "self",
    category: "Admin",
    aliases: ["selfmode"],
    description: "Enable or disable Freezer-MD self mode",
    filename: __filename
}, async (sock, m, args) => {

    // Owner only
    if (!global.owners.includes(m.sender)) {
        return;
    }

    if (args[0] === 'on') {
        selfMode = true;

        await m.reply(
            '🥶 *FREEZER-MD SELF MODE*\n\n' +
            '✅ Self mode is now *ON*\n' +
            '👑 Only Freezer-MD owners and the bot can use commands.'
        );
    }

    else if (args[0] === 'off') {
        selfMode = false;

        await m.reply(
            '🥶 *FREEZER-MD SELF MODE*\n\n' +
            '❌ Self mode is now *OFF*\n' +
            '🌍 Everyone can use Freezer-MD commands.'
        );
    }

    else {
        await m.reply(
            '🥶 *FREEZER-MD SELF MODE*\n\n' +
            `📡 Status: ${selfMode ? '*ON* 🔒' : '*OFF* 🔓'}\n\n` +
            'Use:\n' +
            '• `.self on` — Enable self mode\n' +
            '• `.self off` — Disable self mode'
        );
    }
});

// Gate other commands when self mode is enabled
registered.onMessage = async (sock, m) => {

    if (!selfMode) {
        return false;
    }

    const botNumber =
        sock.user.id.split(':')[0] + '@s.whatsapp.net';

    // Allow owners and the bot itself
    if (
        global.owners.includes(m.sender) ||
        m.sender === botNumber
    ) {
        return false;
    }

    // Block commands from everyone else
    if (
        m.body &&
        m.body.startsWith(global.BOT_PREFIX)
    ) {
        return true;
    }

    return false;
};

module.exports = registered;
