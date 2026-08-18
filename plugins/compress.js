'use strict';

const fs = require('fs');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');

const { cmd } = require('../arslan');

cmd({
    pattern: 'compress',
    name: 'compress',
    category: 'Tools',
    aliases: ['cmp', 'compressvideo'],
    description: 'Compress videos with Freezer-MD',
    filename: __filename
}, async (sock, m) => {

    if (!m.quoted) {
        return m.reply('🥶 *FREEZER-MD*\n\nʀᴇᴘʟʏ ᴛᴏ ᴀ ᴠɪᴅᴇᴏ ᴛᴏ ᴄᴏᴍᴘʀᴇss ɪᴛ.');
    }

    const mime = m.quoted.message?.videoMessage?.mimetype || '';

    if (!mime.includes('video')) {
        return m.reply('🥶 *FREEZER-MD*\n\nʀᴇᴘʟʏ ᴛᴏ ᴀ ᴠɪᴅᴇᴏ ᴛᴏ ᴄᴏᴍᴘʀᴇss ɪᴛ.');
    }

    const timestamp = Date.now();
    const input = `./freezer_input_${timestamp}.mp4`;
    const output = `./freezer_compressed_${timestamp}.mp4`;

    try {
        await m.reply(
            '🥶 *FREEZER-MD*\n\n' +
            '⏳ ᴄᴏᴍᴘʀᴇssɪɴɢ ᴠɪᴅᴇᴏ...\n' +
            '⚙️ ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ'
        );

        const inputStream = await m.quoted.download();
        const writeStream = fs.createWriteStream(input);

        await pipeline(inputStream, writeStream);

        // First compression
        await new Promise((resolve, reject) => {
            const process = spawn(ffmpeg.path, [
                '-y',
                '-i', input,
                '-vcodec', 'libx264',
                '-crf', '28',
                '-preset', 'veryfast',
                '-movflags', '+faststart',
                '-max_muxing_queue_size', '1024',
                output
            ], {
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let stderr = '';

            process.stderr.on('data', data => {
                stderr += data.toString();
            });

            process.on('close', code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(
                        new Error(
                            `FFmpeg exited with code ${code}: ${stderr}`
                        )
                    );
                }
            });

            process.on('error', reject);
        });

        let stats = fs.statSync(output);
        let fileSizeMB = stats.size / (1024 * 1024);

        // Second compression if still too large
        if (fileSizeMB > 100) {

            await m.reply(
                `🥶 *FREEZER-MD*\n\n` +
                `📦 ᴄᴜʀʀᴇɴᴛ sɪᴢᴇ: ${fileSizeMB.toFixed(1)}MB\n` +
                `⚙️ ᴘᴇʀғᴏʀᴍɪɴɢ sᴇᴄᴏɴᴅ ᴄᴏᴍᴘʀᴇssɪᴏɴ...`
            );

            await new Promise((resolve, reject) => {
                const process = spawn(ffmpeg.path, [
                    '-y',
                    '-i', input,
                    '-vcodec', 'libx264',
                    '-crf', '35',
                    '-preset', 'faster',
                    '-vf', 'scale=1280:-2',
                    '-maxrate', '1M',
                    '-bufsize', '2M',
                    '-movflags', '+faststart',
                    output
                ], {
                    stdio: ['ignore', 'pipe', 'pipe']
                });

                let stderr = '';

                process.stderr.on('data', data => {
                    stderr += data.toString();
                });

                process.on('close', code => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(
                            new Error(
                                `FFmpeg exited with code ${code}: ${stderr}`
                            )
                        );
                    }
                });

                process.on('error', reject);
            });

            stats = fs.statSync(output);
            fileSizeMB = stats.size / (1024 * 1024);
        }

        const videoStream = fs.createReadStream(output);

        await sock.sendMessage(
            m.from,
            {
                video: videoStream,
                mimetype: 'video/mp4',
                caption:
                    '🥶 *FREEZER-MD*\n\n' +
                    '✅ ᴠɪᴅᴇᴏ ᴄᴏᴍᴘʀᴇssᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ\n' +
                    `📦 sɪᴢᴇ: ${fileSizeMB.toFixed(1)}MB`
            }
        );

    } catch (e) {

        console.error('Freezer-MD Compress Error:', e);

        await m.reply(
            '🥶 *FREEZER-MD*\n\n' +
            '❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴄᴏᴍᴘʀᴇss ᴠɪᴅᴇᴏ.\n' +
            '⚠️ ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ᴡɪᴛʜ ᴀ ᴅɪғғᴇʀᴇɴᴛ ᴠɪᴅᴇᴏ.'
        );

    } finally {

        try {
            if (fs.existsSync(input)) {
                fs.unlinkSync(input);
            }

            if (fs.existsSync(output)) {
                fs.unlinkSync(output);
            }
        } catch (cleanupError) {
            console.error(
                'Freezer-MD Cleanup Error:',
                cleanupError
            );
        }
    }
});
