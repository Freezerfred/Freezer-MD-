'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'viewonce',
    name: 'viewonce',
    category: 'Tools',
    description: 'Save view-once media',
    aliases: ['vo', 'once'],
    tags: ['tools'],
    command: /^\.?(viewonce|vo|once)$/i,
    filename: __filename
}, async (sock, m) => {

    try {
        if (!m.quoted) {
            return m.reply(
                '╭━━〔 🥶 FREEZER-MD 〕━━╮\n' +
                '┃\n' +
                '┃ ❌ Reply to a view-once\n' +
                '┃    image, video or audio.\n' +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯'
            );
        }

        const target = m.quoted;
        let media;
        let type;
        let mime;

        if (target.message?.imageMessage) {
            type = 'image';
            mime = target.message.imageMessage.mimetype || 'image/jpeg';
            media = await target.download();

        } else if (target.message?.videoMessage) {
            type = 'video';
            mime = target.message.videoMessage.mimetype || 'video/mp4';
            media = await target.download();

        } else if (target.message?.audioMessage) {
            type = 'audio';
            mime = target.message.audioMessage.mimetype || 'audio/ogg';
            media = await target.download();

        } else {
            return m.reply(
                '╭━━〔 🥶 FREEZER-MD 〕━━╮\n' +
                '┃\n' +
                '┃ ❌ Unsupported media.\n' +
                '┃\n' +
                '┃ Supported:\n' +
                '┃ • 🖼️ Image\n' +
                '┃ • 🎥 Video\n' +
                '┃ • 🎵 Audio\n' +
                '┃\n' +
                '╰━━━━━━━━━━━━━━━━━━╯'
            );
        }

        if (!media) {
            throw new Error('Media download failed');
        }

        await m.reply(
            '╭━━〔 🥶 FREEZER-MD 〕━━╮\n' +
            '┃\n' +
            '┃ ⏳ Processing media...\n' +
            '┃ 📦 Type: ' + type.toUpperCase() + '\n' +
            '┃\n' +
            '╰━━━━━━━━━━━━━━━━━━╯'
        );

        const caption =
            '╭━━〔 🥶 FREEZER-MD 〕━━╮\n' +
            '┃\n' +
            '┃ ✅ VIEW-ONCE SAVED\n' +
            '┃\n' +
            '┃ 📦 Type: ' + type.toUpperCase() + '\n' +
            '┃ 🔐 Protected by Freezer-MD\n' +
            '┃\n' +
            '╰━━━━━━━━━━━━━━━━━━╯';

        if (type === 'image') {
            await sock.sendMessage(m.from, {
                image: media,
                mimetype: mime,
                caption
            });

        } else if (type === 'video') {
            await sock.sendMessage(m.from, {
                video: media,
                mimetype: mime,
                caption
            });

        } else {
            await sock.sendMessage(m.from, {
                audio: media,
                mimetype: mime,
                ptt: false
            });
        }

    } catch (error) {

        console.error('Freezer-MD ViewOnce Error:', error);

        await m.reply(
            '╭━━〔 🥶 FREEZER-MD 〕━━╮\n' +
            '┃\n' +
            '┃ ❌ DOWNLOAD FAILED\n' +
            '┃\n' +
            '┃ Something went wrong while\n' +
            '┃ processing the media.\n' +
            '┃\n' +
            '┃ 🔄 Try again.\n' +
            '┃\n' +
            '╰━━━━━━━━━━━━━━━━━━╯'
        );
    }
});
