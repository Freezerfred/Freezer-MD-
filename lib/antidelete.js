'use strict';

const {
    downloadContentFromMessage,
    getContentType
} = require('@whiskeysockets/baileys');

// In-memory store for tracking recent messages so deleted ones can be recovered
if (!global.msgCache) global.msgCache = new Map();

async function AntideleteHandler(sock, rawMsg) {
    try {

        if (
            !rawMsg?.message ||
            rawMsg.key?.remoteJid === 'status@broadcast'
        ) {
            return;
        }

        const from = rawMsg.key.remoteJid;
        const mode = global.antidelete || 'false';

        // ─────────────────────────────────────────
        // CACHE MESSAGE
        // ─────────────────────────────────────────

        if (
            !rawMsg.message.protocolMessage &&
            !rawMsg.key.fromMe
        ) {
            global.msgCache.set(rawMsg.key.id, {
                msg: rawMsg,
                from,
                sender:
                    rawMsg.key.participant ||
                    from,
                pushName:
                    rawMsg.pushName ||
                    'User',
                timestamp: Date.now()
            });

            setTimeout(() => {
                global.msgCache.delete(rawMsg.key.id);
            }, 3600000);
        }

        // ─────────────────────────────────────────
        // DETECT DELETED MESSAGE
        // ─────────────────────────────────────────

        const type =
            getContentType(rawMsg.message);

        if (
            type === 'protocolMessage' &&
            rawMsg.message.protocolMessage.type === 0
        ) {

            if (mode === 'false') return;

            const deletedId =
                rawMsg.message.protocolMessage.key.id;

            const chatData =
                global.msgCache.get(deletedId);

            if (!chatData) return;

            const botNumber =
                sock.user.id.split(':')[0] +
                '@s.whatsapp.net';

            const targetJid =
                mode === 'indm'
                    ? botNumber
                    : from;

            const deletedMsg =
                chatData.msg;

            const sender =
                chatData.sender;

            const time =
                new Date().toLocaleTimeString(
                    'en-KE',
                    {
                        timeZone:
                            'Africa/Nairobi'
                    }
                );

            // ─────────────────────────────────────
            // FREEZER-MD REPORT
            // ─────────────────────────────────────

            const reportHeader =
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮\n` +
                `┃\n` +
                `┃ 🛡️ *ANTI-DELETE*\n` +
                `┃\n` +
                `┃ 👤 *Sender:* @${sender.split('@')[0]}\n` +
                `┃ 🕐 *Time:* ${time}\n` +
                `┃ 💬 *Origin:* ${from.endsWith('@g.us') ? 'Group Chat' : 'Private DM'}\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

            const msgType =
                getContentType(
                    deletedMsg.message
                );

            // ─────────────────────────────────────
            // RECOVER TEXT
            // ─────────────────────────────────────

            if (
                msgType === 'conversation' ||
                msgType === 'extendedTextMessage'
            ) {

                const text =
                    deletedMsg.message.conversation ||
                    deletedMsg.message.extendedTextMessage.text;

                await sock.sendMessage(
                    targetJid,
                    {
                        text:
                            reportHeader +
                            `📝 *Content:* ${text}`,
                        mentions: [sender]
                    },
                    {
                        quoted: deletedMsg
                    }
                );
            }

            // ─────────────────────────────────────
            // RECOVER MEDIA
            // ─────────────────────────────────────

            else if (
                /imageMessage|videoMessage|audioMessage/
                    .test(msgType)
            ) {

                try {

                    const mediaType =
                        msgType.replace(
                            'Message',
                            ''
                        );

                    const stream =
                        await downloadContentFromMessage(
                            deletedMsg.message[msgType],
                            mediaType
                        );

                    const chunks = [];

                    for await (const chunk of stream) {
                        chunks.push(chunk);
                    }

                    const buffer =
                        Buffer.concat(chunks);

                    await sock.sendMessage(
                        targetJid,
                        {
                            [mediaType]: buffer,
                            caption:
                                reportHeader +
                                (
                                    deletedMsg
                                        .message[msgType]
                                        .caption || ''
                                ),
                            mentions: [sender]
                        },
                        {
                            quoted: deletedMsg
                        }
                    );

                } catch (err) {

                    console.error(
                        '[FREEZER-MD] Media recovery failed:',
                        err.message
                    );
                }
            }

            // Remove recovered message from cache
            global.msgCache.delete(deletedId);
        }

    } catch (error) {

        console.error(
            '[FREEZER-MD] Antidelete Error:',
            error.message
        );
    }
}

module.exports = {
    AntideleteHandler
};
