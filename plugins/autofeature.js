'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: "autofeature",
    name: 'autofeature',
    category: 'Admin',
    aliases: ['af'],
    description: 'Control Freezer-MD automatic features',
    filename: __filename
}, async (sock, m, args) => {

    try {

        const prefix = global.BOT_PREFIX || '.';

        // ─────────────────────────────────────────────
        // OWNER CHECK
        // ─────────────────────────────────────────────

        const normalizeJid = (jid) =>
            jid?.split(':')[0];

        const sender =
            normalizeJid(m.sender);

        const owners =
            (global.owners || [])
                .map(normalizeJid);

        const devs =
            (global.dev || [])
                .map(normalizeJid);

        const botId =
            normalizeJid(sock.user?.id);

        const isOwner =
            owners.includes(sender) ||
            devs.includes(sender) ||
            sender === botId;

        if (!isOwner) {
            return;
        }

        // ─────────────────────────────────────────────
        // HELPERS
        // ─────────────────────────────────────────────

        const onOff = (value) => {
            if (value === 'on') return true;
            if (value === 'off') return false;
            return null;
        };

        const status = (value) =>
            value ? '🟢 ON' : '🔴 OFF';

        const sub =
            (args[0] || '').toLowerCase();

        const val =
            (args[1] || '').toLowerCase();

        // ─────────────────────────────────────────────
        // AUTO READ
        // ─────────────────────────────────────────────

        if (sub === 'read') {

            const parsed = onOff(val);

            if (parsed === null) {
                return await m.reply(
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📖 *AUTO-READ*
┃
┃ Current: ${status(global.autoRead)}
┃
┃ Usage:
┃ ${prefix}autofeature read on
┃ ${prefix}autofeature read off
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
                );
            }

            global.autoRead = parsed;

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📖 *AUTO-READ*
┃
┃ Status: ${status(parsed)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // AUTO VIEW
        // ─────────────────────────────────────────────

        if (sub === 'view') {

            const parsed = onOff(val);

            if (parsed === null) {
                return await m.reply(
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 👁️ *AUTO-VIEW STATUS*
┃
┃ Current: ${status(global.autoView)}
┃
┃ Usage:
┃ ${prefix}autofeature view on
┃ ${prefix}autofeature view off
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
                );
            }

            global.autoView = parsed;

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 👁️ *AUTO-VIEW*
┃
┃ Status: ${status(parsed)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // AUTO LIKE
        // ─────────────────────────────────────────────

        if (sub === 'like') {

            const parsed = onOff(val);

            if (parsed === null) {
                return await m.reply(
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❤️ *AUTO-LIKE STATUS*
┃
┃ Current: ${status(global.autoLike)}
┃
┃ Usage:
┃ ${prefix}autofeature like on
┃ ${prefix}autofeature like off
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
                );
            }

            global.autoLike = parsed;

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❤️ *AUTO-LIKE*
┃
┃ Status: ${status(parsed)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // PRESENCE
        // ─────────────────────────────────────────────

        if (sub === 'presence') {

            const modes = [
                'none',
                'typing',
                'recording',
                'online'
            ];

            if (!modes.includes(val)) {

                return await m.reply(
                    `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📡 *PRESENCE MODE*
┃
┃ Current:
┃ ${global.presenceMode || 'none'}
┃
┃ Available modes:
┃
┃ • none
┃ • typing
┃ • recording
┃ • online
┃
┃ Usage:
┃ ${prefix}autofeature presence typing
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
                );
            }

            global.presenceMode = val;

            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 📡 *PRESENCE UPDATED*
┃
┃ Mode: *${val.toUpperCase()}*
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────────────────────────
        // MAIN CONTROL PANEL
        // ─────────────────────────────────────────────

        return await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃      *AUTO FEATURES*
┃
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━━〔 ⚙️ CURRENT STATUS 〕
┃
┃ 📖 Auto-Read
┃ └─ ${status(global.autoRead)}
┃
┃ 👁️ Auto-View
┃ └─ ${status(global.autoView)}
┃
┃ ❤️ Auto-Like
┃ └─ ${status(global.autoLike)}
┃
┃ 📡 Presence
┃ └─ 🟢 ${(global.presenceMode || 'none').toUpperCase()}
┃
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━━〔 🛠️ CONTROLS 〕
┃
┃ ${prefix}autofeature read on/off
┃ ${prefix}autofeature view on/off
┃ ${prefix}autofeature like on/off
┃ ${prefix}autofeature presence
┃ └─ none
┃ └─ typing
┃ └─ recording
┃ └─ online
┃
╰━━━━━━━━━━━━━━━━━━━━━━

> ❄️ *Freezer-MD Admin System*`
        );

    } catch (err) {

        console.error(
            '❌ Freezer AutoFeature Error:',
            err
        );

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *AUTO FEATURE ERROR*
┃
┃ ${String(
                err.message || err
            ).substring(0, 150)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        ).catch(() => {});
    }
});
