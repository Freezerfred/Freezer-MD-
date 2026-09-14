const { cmd } = require('../arslan');

cmd({
    pattern: "welcome",
    name: "welcome",
    category: "Group",
    aliases: ["welcome-toggle"],
    description: "Toggle Freezer-MD group welcome/goodbye messages",
    enabled: true,
    filename: __filename
}, async (sock, m, args) => {

    // =========================
    // GROUP CHECK
    // =========================
    if (!m.isGroup) {
        return m.reply(
            `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
            `┃\n` +
            `┃ ❌ This command only works\n` +
            `┃    in groups.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );
    }

    // =========================
    // ADMIN CHECK
    // =========================
    const metadata = await sock.groupMetadata(m.from);

    const sender = metadata.participants.find(p =>
        p.phoneNumber === m.sender || p.id === m.sender
    );

    const isAdmin =
        sender?.admin === "admin" ||
        sender?.admin === "superadmin";

    if (!isAdmin) {
        return m.reply(
            `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
            `┃\n` +
            `┃ ❌ *ADMINS ONLY*\n` +
            `┃\n` +
            `┃ You need to be a group admin\n` +
            `┃ to change welcome settings.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );
    }

    // =========================
    // DEFAULT CONFIG
    // =========================
    if (!global.welcomeConfig) {
        global.welcomeConfig = {
            enabled: true
        };
    }

    // =========================
    // SHOW STATUS
    // =========================
    if (!args[0]) {
        return m.reply(
            `╭━━━〔 ❄️ *FREEZER-MD* 〕━━━╮\n` +
            `┃\n` +
            `┃ 👋 *WELCOME SYSTEM*\n` +
            `┃\n` +
            `┃ Status : ${global.welcomeConfig.enabled ? "✅ ON" : "❌ OFF"}\n` +
            `┃\n` +
            `┣━━━〔 ⚙️ USAGE 〕━━━\n` +
            `┃\n` +
            `┃ ${global.BOT_PREFIX}welcome on\n` +
            `┃ ${global.BOT_PREFIX}welcome off\n` +
            `┃\n` +
            `┣━━━〔 🛡️ FEATURES 〕━━━\n` +
            `┃\n` +
            `┃ 👋 New members → Welcome\n` +
            `┃ 🚪 Members leaving → Goodbye\n` +
            `┃ ⚙️ Admin controlled\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━╯\n` +
            `\n` +
            `❄️ *Protected by Freezer-MD*`
        );
    }

    const option = args[0].toLowerCase();

    // =========================
    // ENABLE
    // =========================
    if (option === "on") {

        global.welcomeConfig.enabled = true;

        return m.reply(
            `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
            `┃\n` +
            `┃ ✅ *WELCOME ENABLED*\n` +
            `┃\n` +
            `┃ 👋 Welcome messages: ON\n` +
            `┃ 🚪 Goodbye messages: ON\n` +
            `┃\n` +
            `┃ 🛡️ Group protection active.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );
    }

    // =========================
    // DISABLE
    // =========================
    if (option === "off") {

        global.welcomeConfig.enabled = false;

        return m.reply(
            `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
            `┃\n` +
            `┃ ❌ *WELCOME DISABLED*\n` +
            `┃\n` +
            `┃ 👋 Welcome messages: OFF\n` +
            `┃ 🚪 Goodbye messages: OFF\n` +
            `┃\n` +
            `┃ ℹ️ The system is currently inactive.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
        );
    }

    // =========================
    // INVALID OPTION
    // =========================
    return m.reply(
        `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
        `┃\n` +
        `┃ ❌ *INVALID OPTION*\n` +
        `┃\n` +
        `┃ Use:\n` +
        `┃ ${global.BOT_PREFIX}welcome on\n` +
        `┃ ${global.BOT_PREFIX}welcome off\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`
    );
});
