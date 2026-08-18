'use strict';

const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const { cmd } = require('../arslan');

cmd({
    pattern: 'viewonce',
    name: 'viewonce',
    category: 'Tools',
    aliases: ['vv', 'vo', 'view'],
    description: 'Retrieve quoted view-once images or videos',
    filename: __filename
}, async (sock, m) => {

    try {

        // ─────────────────────────────────────────
        // CHECK QUOTED MESSAGE
        // ─────────────────────────────────────────

        const quoted =
            m.quoted ||
            m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return m.reply(
                `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *No quoted message*
┃
┃ Reply to a view-once
┃ image or video with:
┃
┃ ➜ *.viewonce*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // ─────────────────────────────────────────
        // FIND VIEW-ONCE MESSAGE
        // ─────────────────────────────────────────

        let message =
            quoted.message ||
            quoted;

        if (message.ephemeralMessage) {
            message = message.ephemeralMessage.message;
        }

        const viewOnce =
            message.viewOnceMessageV2?.message ||
            message.viewOnceMessage?.message ||
            message.viewOnceMessageV2Extension?.message;

        if (!viewOnce) {
            return m.reply(
                `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Not a view-once*
┃
┃ Reply directly to a
┃ view-once image/video.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // ─────────────────────────────────────────
        // IMAGE
        // ─────────────────────────────────────────

        if (viewOnce.imageMessage) {

            const image =
                viewOnce.imageMessage;

            const stream =
                await downloadContentFromMessage(
                    image,
                    'image'
                );

            const chunks = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const buffer =
                Buffer.concat(chunks);

            return await sock.sendMessage(
                m.from,
                {
                    image: buffer,
                    caption:
                        image.caption ||
                        '❄️ *FREEZER-MD • VIEW ONCE*'
                }
            );
        }

        // ─────────────────────────────────────────
        // VIDEO
        // ─────────────────────────────────────────

        if (viewOnce.videoMessage) {

            const video =
                viewOnce.videoMessage;

            const stream =
                await downloadContentFromMessage(
                    video,
                    'video'
                );

            const chunks = [];

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const buffer =
                Buffer.concat(chunks);

            return await sock.sendMessage(
                m.from,
                {
                    video: buffer,
                    caption:
                        video.caption ||
                        '❄️ *FREEZER-MD • VIEW ONCE*'
                }
            );
        }

        // ─────────────────────────────────────────
        // UNSUPPORTED MEDIA
        // ─────────────────────────────────────────

        return m.reply(
            `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⚠️ *Unsupported media*
┃
┃ Only view-once images
┃ and videos are supported.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] ViewOnce Error:',
            error
        );

        return m.reply(
            `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *VIEW ONCE FAILED*
┃
┃ Unable to retrieve
┃ the media.
┃
┃ ${error?.message || 'Unknown error'}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
