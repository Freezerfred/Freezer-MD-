'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'play',
    name: 'play',
    category: 'Downloaders',
    aliases: ['ply', 'playy', 'pl'],
    description: 'Download songs from YouTube and send audio',
    filename: __filename
}, async (sock, m, args) => {

    await m.react('⌛').catch(() => {});

    try {
        const query = args && args.length
            ? args.join(' ').trim()
            : '';

        // ─────────────────────────────────────
        // QUERY VALIDATION
        // ─────────────────────────────────────

        if (!query) {
            await m.react('❌').catch(() => {});

            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD PLAY*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Missing song name*
┃
┃ 🎵 Enter a song name
┃ 🔗 Or send a YouTube link
┃
┃ Example:
┃ ${global.BOT_PREFIX || '.'}play Shape of You
┃
╰━━━━━━━━━━━━━━━━━━━━╯
> ❄️ *FREEZER-MD*`
            );
        }

        // ─────────────────────────────────────
        // YOUTUBE LINK CHECK
        // ─────────────────────────────────────

        const isYoutubeLink =
            /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?[a-zA-Z0-9_-]{11})/i
                .test(query);

        let audioUrl;
        let filename;
        let thumbnail = '';
        let sourceUrl = '';

        // ─────────────────────────────────────
        // YOUTUBE URL DOWNLOAD
        // ─────────────────────────────────────

        if (isYoutubeLink) {

            const response = await fetch(
                `https://api.sidycoders.xyz/api/ytdl?url=${encodeURIComponent(query)}&format=mp3&apikey=memberdycoders`
            );

            if (!response.ok) {
                throw new Error('YouTube downloader API unavailable.');
            }

            const data = await response.json();

            if (!data.status || !data.cdn) {
                await m.react('❌').catch(() => {});

                return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD PLAY*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *DOWNLOAD FAILED*
┃
┃ The YouTube link could not
┃ be processed.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            audioUrl = data.cdn;
            filename = data.title || 'Unknown YouTube Song';
            sourceUrl = query;

        } else {

            // ─────────────────────────────────
            // SEARCH DOWNLOAD
            // ─────────────────────────────────

            if (query.length > 100) {
                await m.react('❌').catch(() => {});

                return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD PLAY*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *QUERY TOO LONG*
┃
┃ Maximum: 100 characters.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            const response = await fetch(
                `https://apiziaul.vercel.app/api/downloader/ytplaymp3?query=${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                throw new Error('Music search API unavailable.');
            }

            const data = await response.json();

            if (!data.status || !data.result?.downloadUrl) {
                await m.react('❌').catch(() => {});

                return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD PLAY*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *SONG NOT FOUND*
┃
┃ Try another song title.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            audioUrl = data.result.downloadUrl;
            filename = data.result.title || 'Unknown Song';
            thumbnail = data.result.thumbnail || '';
            sourceUrl = data.result.videoUrl || '';
        }

        // ─────────────────────────────────────
        // SUCCESS
        // ─────────────────────────────────────

        await m.react('✅').catch(() => {});

        const safeFilename =
            filename.replace(/[<>:"/\\|?*]/g, '_');

        // ─────────────────────────────────────
        // SEND AUDIO
        // ─────────────────────────────────────

        await sock.sendMessage(m.from, {
            audio: {
                url: audioUrl
            },
            mimetype: 'audio/mpeg',
            fileName: `${safeFilename}.mp3`,

            contextInfo: thumbnail
                ? {
                    externalAdReply: {
                        title: filename.substring(0, 30),
                        body: '❄️ FREEZER-MD',
                        thumbnailUrl: thumbnail,
                        sourceUrl: sourceUrl,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
                : undefined
        });

        // ─────────────────────────────────────
        // SEND DOCUMENT COPY
        // ─────────────────────────────────────

        await sock.sendMessage(m.from, {
            document: {
                url: audioUrl
            },
            mimetype: 'audio/mpeg',
            fileName: `${safeFilename}.mp3`,
            caption:
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD PLAY*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🎵 *${filename}*
┃
┃ ✅ Download complete
┃
╰━━━━━━━━━━━━━━━━━━━━╯
> ❄️ *FREEZER-MD • BUILT DIFFERENT*`
        });

    } catch (error) {

        console.error(
            '[FREEZER-MD] Play Error:',
            error
        );

        await m.react('❌').catch(() => {});

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD PLAY*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *PLAY ERROR*
┃
┃ Unable to download the
┃ requested song right now.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
