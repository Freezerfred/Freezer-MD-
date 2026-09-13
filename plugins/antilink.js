const { setAntilink, getAntilink, removeAntilink } = require('../lib/antilink');
const { cmd } = require('../arslan');

cmd({
    pattern: "antilink",
    name: "antilink",
    aliases: ["alink", "linkblock"],
    category: "Admin",
    description: "Protect the group by blocking links",
    filename: __filename
}, async (sock, m, args) => {

    const chatId = m.from;

    // =========================
    // GROUP CHECK
    // =========================
    if (!m.isGroup) {
        return m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `❌ This command can only be used in a group.`
        );
    }

    // =========================
    // ADMIN CHECK
    // =========================
    if (!m.isAdmin && !m.isOwner) {
        return m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `❌ Only group admins can use this command.`
        );
    }

    const action = (args[0] || "").toLowerCase();

    // =========================
    // MAIN MENU
    // =========================
    if (!action) {
        const config = await getAntilink(chatId);

        return m.reply(
            `╭━━━〔 ❄️ *FREEZER-MD* 〕━━━╮\n` +
            `┃\n` +
            `┃ 🔗 *ANTILINK PROTECTION*\n` +
            `┃\n` +
            `┃ Status  : ${config?.enabled ? "✅ Enabled" : "❌ Disabled"}\n` +
            `┃ Action  : ${config?.action || "Not set"}\n` +
            `┃\n` +
            `┣━━━〔 ⚙️ COMMANDS 〕━━━\n` +
            `┃\n` +
            `┃ ❄️ .antilink on\n` +
            `┃ ❄️ .antilink off\n` +
            `┃ ❄️ .antilink set delete\n` +
            `┃ ❄️ .antilink set kick\n` +
            `┃ ❄️ .antilink set warn\n` +
            `┃ ❄️ .antilink status\n` +
            `┃\n` +
            `┣━━━〔 🛡️ PROTECTION 〕━━━\n` +
            `┃\n` +
            `┃ • WhatsApp Groups\n` +
            `┃ • WhatsApp Channels\n` +
            `┃ • Telegram Links\n` +
            `┃ • Social & Website Links\n` +
            `┃ • Other URLs\n` +
            `┃\n` +
            `┣━━━〔 👑 EXEMPTIONS 〕━━━\n` +
            `┃\n` +
            `┃ • Group Admins\n` +
            `┃ • Bot Owner\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━╯\n` +
            `\n` +
            `❄️ *FREEZER-MD • GROUP PROTECTION*`
        );
    }

    // =========================
    // ENABLE
    // =========================
    switch (action) {

        case "on": {
            const existingConfig = await getAntilink(chatId);

            if (existingConfig?.enabled) {
                return m.reply(
                    `❄️ *FREEZER-MD*\n\n` +
                    `⚠️ Antilink protection is already enabled.`
                );
            }

            const result = await setAntilink(chatId, "delete");

            return m.reply(
                result
                    ? `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
                      `┃\n` +
                      `┃ ✅ *ANTILINK ENABLED*\n` +
                      `┃\n` +
                      `┃ Default Action: 🗑️ Delete\n` +
                      `┃\n` +
                      `┃ 🛡️ Admins are exempt\n` +
                      `┃ 👑 Owner is exempt\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━━━━╯`
                    : `❌ *Freezer-MD:* Failed to enable antilink.`
            );
        }

        // =========================
        // DISABLE
        // =========================
        case "off": {

            await removeAntilink(chatId);

            return m.reply(
                `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
                `┃\n` +
                `┃ ❌ *ANTILINK DISABLED*\n` +
                `┃\n` +
                `┃ 🔓 Members can now send links.\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // =========================
        // SET ACTION
        // =========================
        case "set": {

            if (args.length < 2) {
                return m.reply(
                    `❄️ *FREEZER-MD — ANTILINK*\n\n` +
                    `❌ Please specify an action.\n\n` +
                    `Usage:\n` +
                    `• .antilink set delete\n` +
                    `• .antilink set kick\n` +
                    `• .antilink set warn`
                );
            }

            const setAction = args[1].toLowerCase();

            if (!["delete", "kick", "warn"].includes(setAction)) {
                return m.reply(
                    `❄️ *FREEZER-MD*\n\n` +
                    `❌ Invalid action.\n\n` +
                    `Available:\n` +
                    `🗑️ delete\n` +
                    `🥶 kick\n` +
                    `⚠️ warn`
                );
            }

            const setResult = await setAntilink(chatId, setAction);

            const actionDescriptions = {
                delete: "🗑️ Delete link messages + warn user",
                kick: "🥶 Delete message + remove user",
                warn: "⚠️ Warn user only"
            };

            return m.reply(
                setResult
                    ? `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
                      `┃\n` +
                      `┃ ✅ *ANTILINK UPDATED*\n` +
                      `┃\n` +
                      `┃ Action:\n` +
                      `┃ ${actionDescriptions[setAction]}\n` +
                      `┃\n` +
                      `┃ 🛡️ Admins exempt\n` +
                      `┃ 👑 Owner exempt\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━━━━╯`
                    : `❌ *Freezer-MD:* Failed to update antilink.`
            );
        }

        // =========================
        // STATUS
        // =========================
        case "status":
        case "get": {

            const status = await getAntilink(chatId);

            let behaviorNote = "• No action configured";

            if (status?.action === "delete") {
                behaviorNote =
                    `• 🗑️ Link message deleted\n` +
                    `• ⚠️ User receives warning`;
            }

            else if (status?.action === "kick") {
                behaviorNote =
                    `• 🗑️ Link message deleted\n` +
                    `• 🥶 User removed from group`;
            }

            else if (status?.action === "warn") {
                behaviorNote =
                    `• ⚠️ User receives warning\n` +
                    `• 💬 Message remains`;
            }

            return m.reply(
                `╭━━━〔 ❄️ *FREEZER-MD* 〕━━━╮\n` +
                `┃\n` +
                `┃ 🔗 *ANTILINK STATUS*\n` +
                `┃\n` +
                `┃ Status : ${status?.enabled ? "✅ Enabled" : "❌ Disabled"}\n` +
                `┃ Action : ${status?.action || "Not set"}\n` +
                `┃\n` +
                `┣━━━〔 🛡️ BEHAVIOUR 〕━━━\n` +
                `┃\n` +
                `┃ ${behaviorNote.replace(/\n/g, "\n┃ ")}\n` +
                `┃\n` +
                `┣━━━〔 👑 EXEMPT 〕━━━\n` +
                `┃\n` +
                `┃ • Group Admins\n` +
                `┃ • Bot Owner\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━╯\n` +
                `\n` +
                `❄️ *Protected by Freezer-MD*`
            );
        }

        // =========================
        // INVALID COMMAND
        // =========================
        default:
            return m.reply(
                `╭━━〔 ❄️ *FREEZER-MD* 〕━━╮\n` +
                `┃\n` +
                `┃ ❌ *Invalid antilink command*\n` +
                `┃\n` +
                `┃ Use:\n` +
                `┃ .antilink\n` +
                `┃\n` +
                `┃ to view all available options.\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━╯`
            );
    }
});
