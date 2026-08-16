'use strict';

const {
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    proto
} = require('@whiskeysockets/baileys');

const { cmd } = require('../arslan');

cmd({
    pattern: "groupstatus",
    name: 'groupstatus',
    category: 'Status',
    description: 'Send a group status silently',
    aliases: ['gstatus'],
    tags: ['group', 'status'],
    command: /^\.?(groupstatus|gstatus)$/i,
    filename: __filename
}, async (sock, m, args) => {

    try {

        const prefix = global.BOT_PREFIX || '.';

        // ─────────────────────────────────────────────
        // JID NORMALIZER
        // ─────────────────────────────────────────────

        const normalize = jid =>
            jid?.split(':')[0];

        const sender =
            normalize(m.sender);

        const botId =
            normalize(sock.user?.id);

        const owners =
            (global.owners || [])
                .map(normalize);

        // ─────────────────────────────────────────────
        // OWNER CHECK
        // ─────────────────────────────────────────────

        const isOwner =
            owners.includes(sender) ||
            sender === botId;

        if (!isOwner) {
            return;
        }

        // ─────────────────────────────────────────────
        // STATUS COLORS
        // ─────────────────────────────────────────────

        const COLORS = {
            green: 0xFF25D366,
            red: 0xFFFF0000,
            blue: 0xFF0000FF,
            yellow: 0xFFFFFF00,
            purple: 0xFF800080,
            black: 0xFF000000,
            white: 0xFFFFFFFF,
            orange: 0xFFFFA500
        };

        let groupId;
        let messageText;
        let chosenColor = COLORS.green;
        let quoted = m.quoted;

        // ─────────────────────────────────────────────
        // OUTSIDE GROUP
        // ─────────────────────────────────────────────

        if (!m.isGroup) {

            // Quoted media mode
            if (quoted) {

                if (!args.length) {
                    return await sock.sendMessage(
                        m.from,
                        {
                            text:
                                `❄️ *FREEZER-MD*\n\n` +
                                `Please provide the target group JID.\n\n` +
                                `Usage:\n` +
                                `${prefix}gstatus <group-jid>\n\n` +
                                `Example:\n` +
                                `${prefix}gstatus 123456789-123456@g.us`
                        }
                    );
                }

                groupId = args[0];

            } else {

                if (!args.length) {
                    return await sock.sendMessage(
                        m.from,
                        {
                            text:
                                `❄️ *FREEZER-MD*\n\n` +
                                `Invalid format.\n\n` +
                                `Usage:\n` +
                                `${prefix}gstatus groupjid,text,color\n\n` +
                                `Example:\n` +
                                `${prefix}gstatus 123456789-123456@g.us,Hello group!,blue`
                        }
                    );
                }

                const fullText =
                    args.join(' ');

                const parts =
                    fullText
                        .split(',')
                        .map(part => part.trim());

                if (parts.length < 2) {
                    return await sock.sendMessage(
                        m.from,
                        {
                            text:
                                `❌ *FREEZER-MD ERROR*\n\n` +
                                `Please provide:\n` +
                                `1. Group JID\n` +
                                `2. Status text\n\n` +
                                `Example:\n` +
                                `${prefix}gstatus 123456789-123456@g.us,Hello group!,blue`
                        }
                    );
                }

                groupId = parts[0];
                messageText = parts[1];

                if (parts[2]) {

                    const color =
                        parts[2].toLowerCase();

                    if (COLORS[color]) {
                        chosenColor =
                            COLORS[color];
                    }
                }
            }

        } else {

            // Inside a group, target current group
            groupId = m.from;
            quoted = m.quoted;
        }

        // ─────────────────────────────────────────────
        // VALIDATE GROUP JID
        // ─────────────────────────────────────────────

        if (
            !groupId ||
            !groupId.endsWith('@g.us')
        ) {

            if (!m.isGroup) {
                return await sock.sendMessage(
                    m.from,
                    {
                        text:
                            `❌ *INVALID GROUP JID*\n\n` +
                            `Example:\n` +
                            `123456789-123456@g.us`
                    }
                );
            }

            return;
        }

        // ─────────────────────────────────────────────
        // BUILD STATUS MESSAGE
        // ─────────────────────────────────────────────

        let innerMessage;

        if (quoted) {

            // IMAGE
            if (quoted.message?.imageMessage) {

                const buffer =
                    await quoted.download();

                const media =
                    await prepareWAMessageMedia(
                        {
                            image: buffer,
                            caption:
                                quoted.message
                                    .imageMessage
                                    .caption || ''
                        },
                        {
                            upload:
                                sock.waUploadToServer
                        }
                    );

                innerMessage = {
                    imageMessage:
                        media.imageMessage
                };
            }

            // VIDEO
            else if (
                quoted.message?.videoMessage
            ) {

                const buffer =
                    await quoted.download();

                const media =
                    await prepareWAMessageMedia(
                        {
                            video: buffer,
                            caption:
                                quoted.message
                                    .videoMessage
                                    .caption || ''
                        },
                        {
                            upload:
                                sock.waUploadToServer
                        }
                    );

                innerMessage = {
                    videoMessage:
                        media.videoMessage
                };
            }

            // AUDIO
            else if (
                quoted.message?.audioMessage
            ) {

                const buffer =
                    await quoted.download();

                const media =
                    await prepareWAMessageMedia(
                        {
                            audio: buffer,
                            mimetype:
                                quoted.message
                                    .audioMessage
                                    .mimetype ||
                                'audio/mp4',
                            ptt:
                                quoted.message
                                    .audioMessage
                                    .ptt || false
                        },
                        {
                            upload:
                                sock.waUploadToServer
                        }
                    );

                innerMessage = {
                    audioMessage:
                        media.audioMessage
                };
            }

            // UNSUPPORTED
            else {

                if (!m.isGroup) {
                    return await sock.sendMessage(
                        m.from,
                        {
                            text:
                                `❌ *UNSUPPORTED MEDIA*\n\n` +
                                `Quote an image, video, or audio message.`
                        }
                    );
                }

                return;
            }

        } else {

            if (!messageText) {

                if (!m.isGroup) {
                    return await sock.sendMessage(
                        m.from,
                        {
                            text:
                                `❌ *NO STATUS TEXT*\n\n` +
                                `Please provide status text.`
                        }
                    );
                }

                return;
            }

            // TEXT STATUS
            innerMessage = {
                extendedTextMessage: {
                    text: messageText,
                    backgroundArgb:
                        chosenColor,
                    font: 1
                }
            };
        }

        // ─────────────────────────────────────────────
        // GROUP STATUS PAYLOAD
        // ─────────────────────────────────────────────

        const content = {
            groupStatusMessageV2: {
                message: innerMessage
            }
        };

        const msg =
            generateWAMessageFromContent(
                groupId,
                proto.Message.fromObject(
                    content
                ),
                {
                    userJid:
                        sock.user.id
                }
            );

        // ─────────────────────────────────────────────
        // SEND GROUP STATUS
        // ─────────────────────────────────────────────

        await sock.relayMessage(
            groupId,
            msg.message,
            {
                messageId: msg.key.id
            }
        );

        // ─────────────────────────────────────────────
        // SUCCESS MESSAGE
        // ─────────────────────────────────────────────

        if (!m.isGroup) {

            await sock.sendMessage(
                m.from,
                {
                    text:
                        `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ✅ *GROUP STATUS SENT*
┃
┃ 🎯 *TARGET:* ${groupId}
┃
┃ 🚀 Status published successfully.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
                }
            );
        }

    } catch (err) {

        console.error(
            '❌ Freezer GroupStatus Error:',
            err
        );

        if (!m.isGroup) {

            await sock.sendMessage(
                m.from,
                {
                    text:
                        `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *GROUP STATUS FAILED*
┃
┃ ${String(
                            err.message ||
                            err
                        ).substring(0, 180)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
                }
            ).catch(() => {});
        }
    }
});
