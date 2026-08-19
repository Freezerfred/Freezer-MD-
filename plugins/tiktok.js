'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { cmd } = require('../arslan');

cmd({
    pattern: 'tiktok',
    name: 'tiktok',
    category: 'Downloaders',
    description: 'Download TikTok videos without watermark',
    aliases: ['tt', 'tiktokdl', 'ttdl'],
    tags: ['downloader'],
    command: /^\.?(tiktok|tt|tiktokdl|ttdl)$/i,
    filename: __filename
}, async (sock, m, args) => {

    let filePath = null;

    try {
        if (!args.length) {
            return await m.reply(
`ᴜsᴀɢᴇ: .ᴛɪᴋᴛᴏᴋ <ᴜʀʟ>

ᴇxᴀᴍᴘʟᴇ: .ᴛɪᴋᴛᴏᴋ https://vt.tiktok.com/ZSrRVYRUJ/`
            );
        }

        const url = args[0].trim();

        if (!/^https?:\/\/([a-z0-9-]+\.)?tiktok\.com\//i.test(url)) {
            return await m.reply(
                'ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴛɪᴋᴛᴏᴋ ᴜʀʟ'
            );
        }

        await m.reply(
            'ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ...'
        );

        const apiUrl =
            `https://api-rebix.zone.id/api/tiktok2?url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiUrl, {
            timeout: 30000
        });

        if (
            !response.data?.status ||
            !response.data?.result
        ) {
            return await m.reply(
`ғᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ

ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.`
            );
        }

        const result = response.data.result;
        const videoUrl = result.play;

        if (!videoUrl) {
            return await m.reply(
                'ɴᴏ ᴠɪᴅᴇᴏ ᴜʀʟ ғᴏᴜɴᴅ'
            );
        }

        const videoResponse = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            timeout: 120000,
            maxContentLength: 100 * 1024 * 1024,
            maxBodyLength: 100 * 1024 * 1024
        });

        const videoBuffer = Buffer.from(videoResponse.data);

        const tempDir = path.join(
            __dirname,
            '../temp'
        );

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, {
                recursive: true
            });
        }

        const videoId =
            String(result.id || Date.now())
                .replace(/[^a-zA-Z0-9_-]/g, '');

        filePath = path.join(
            tempDir,
            `tiktok_${videoId}.mp4`
        );

        fs.writeFileSync(
            filePath,
            videoBuffer
        );

        const caption =
`*🥶 FREEZER-MD TIKTOK DOWNLOADER*

ᴛɪᴛʟᴇ: ${result.title || 'ɴᴏ ᴛɪᴛʟᴇ'}
ᴅᴜʀᴀᴛɪᴏɴ: ${result.duration || 0}s
ᴠɪᴇᴡs: ${result.play_count || 0}
ʟɪᴋᴇs: ${result.digg_count || 0}
ᴄᴏᴍᴍᴇɴᴛs: ${result.comment_count || 0}
sʜᴀʀᴇs: ${result.share_count || 0}

ᴀᴜᴛʜᴏʀ: ${result.author?.nickname || 'ᴜɴᴋɴᴏᴡɴ'}
@${result.author?.unique_id || 'ᴜɴᴋɴᴏᴡɴ'}

*ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ 🥶 FREEZER-MD*`;

        await sock.sendMessage(
            m.from,
            {
                video: videoBuffer,
                caption,
                mimetype: 'video/mp4'
            },
            {
                quoted: m.key
            }
        );

    } catch (err) {

        console.error(
            '[FREEZER-MD] TikTok Error:',
            err
        );

        await m.reply(
`❌ *FREEZER-MD ERROR*

ғᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴛʜᴇ ᴠɪᴅᴇᴏ.

ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.`
        );

    } finally {

        if (
            filePath &&
            fs.existsSync(filePath)
        ) {
            try {
                fs.unlinkSync(filePath);
            } catch (cleanupError) {
                console.error(
                    '[FREEZER-MD] Temp cleanup error:',
                    cleanupError
                );
            }
        }
    }
});
