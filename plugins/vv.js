const { cmd } = require('../arslan');

cmd({
    pattern: "viewonce",
    name: "viewonce",
    category: "Tools",
    description: "Save view-once image, video or audio",
    aliases: ["vo", "once"],
    tags: ["tools", "media"],
    command: /^\.?(viewonce|vo|once)$/i,
    filename: __filename
}, async (sock, m) => {
    try {
        // ❄️ Check quoted message
        if (!m.quoted) {
            return m.reply(
                "❄️ *FREEZER-MD*\n\n" +
                "╭─〔 VIEW ONCE 〕\n" +
                "│ ❌ Please reply to a *View Once* media.\n" +
                "│\n" +
                "│ Usage: *.viewonce*\n" +
                "╰──────────────"
            );
        }

        const targetMsg = m.quoted;
        const message = targetMsg.message || {};

        console.log(
            "❄️ Freezer-MD | Quoted message:",
            Object.keys(message)
        );

        let mediaBuffer;
        let mimeType;
        let mediaType;

        // 🖼️ IMAGE
        if (message.imageMessage) {
            console.log("❄️ Freezer-MD | Downloading image...");

            mediaBuffer = await targetMsg.download();
            mimeType = message.imageMessage.mimetype || "image/jpeg";
            mediaType = "image";
        }

        // 🎥 VIDEO
        else if (message.videoMessage) {
            console.log("❄️ Freezer-MD | Downloading video...");

            mediaBuffer = await targetMsg.download();
            mimeType = message.videoMessage.mimetype || "video/mp4";
            mediaType = "video";
        }

        // 🎵 AUDIO
        else if (message.audioMessage) {
            console.log("❄️ Freezer-MD | Downloading audio...");

            mediaBuffer = await targetMsg.download();
            mimeType = message.audioMessage.mimetype || "audio/ogg";
            mediaType = "audio";
        }

        // ❌ UNSUPPORTED
        else {
            return m.reply(
                "❄️ *FREEZER-MD*\n\n" +
                "╭─〔 VIEW ONCE 〕\n" +
                "│ ❌ Unsupported media type.\n" +
                "│\n" +
                "│ Supported:\n" +
                "│ 🖼️ Image\n" +
                "│ 🎥 Video\n" +
                "│ 🎵 Audio\n" +
                "╰──────────────"
            );
        }

        if (!mediaBuffer) {
            throw new Error("Media download returned empty buffer");
        }

        console.log(
            `❄️ Freezer-MD | ${mediaType} downloaded: ${mediaBuffer.length} bytes`
        );

        // 🖼️ SEND IMAGE
        if (mediaType === "image") {
            await sock.sendMessage(m.from, {
                image: mediaBuffer,
                mimetype: mimeType,
                caption:
                    "❄️ *FREEZER-MD*\n\n" +
                    "╭─〔 VIEW ONCE 〕\n" +
                    "│ ✅ Image saved successfully.\n" +
                    "│\n" +
                    "│ 🛡️ Protected by Freezer\n" +
                    "╰──────────────"
            });
        }

        // 🎥 SEND VIDEO
        else if (mediaType === "video") {
            await sock.sendMessage(m.from, {
                video: mediaBuffer,
                mimetype: mimeType,
                caption:
                    "❄️ *FREEZER-MD*\n\n" +
                    "╭─〔 VIEW ONCE 〕\n" +
                    "│ ✅ Video saved successfully.\n" +
                    "│\n" +
                    "│ 🛡️ Protected by Freezer\n" +
                    "╰──────────────"
            });
        }

        // 🎵 SEND AUDIO
        else if (mediaType === "audio") {
            await sock.sendMessage(m.from, {
                audio: mediaBuffer,
                mimetype: mimeType,
                ptt: false
            });
        }

        console.log(
            `❄️ Freezer-MD | ${mediaType} sent successfully`
        );

    } catch (error) {
        console.error("❄️ Freezer-MD | ViewOnce Error:", error);

        return m.reply(
            "❄️ *FREEZER-MD*\n\n" +
            "╭─〔 VIEW ONCE 〕\n" +
            "│ ❌ Failed to save media.\n" +
            "│\n" +
            "│ Try replying directly to\n" +
            "│ the View Once message.\n" +
            "╰──────────────"
        );
    }
});
