const { cmd } = require('../arslan');
const axios = require('axios');
const FormData = require('form-data');

cmd({
    pattern: "tourl",
    name: "tourl",
    category: "Tools",
    description: "Upload media and get a public URL",
    aliases: ["url"],
    command: /^\.?(tourl|url)$/i,
    filename: __filename
}, async (sock, m) => {
    try {
        if (!m.quoted) {
            return m.reply("❌ Reply to an image, video, audio or document.");
        }

        const buffer = await m.quoted.download();
        if (!buffer) return m.reply("❌ Failed to download media.");

        const form = new FormData();
        form.append("file", buffer, {
            filename: "freezer-media"
        });

        const { data } = await axios.post(
            "https://tmpfiles.org/api/v1/upload",
            form,
            { headers: form.getHeaders() }
        );

        if (!data?.data?.url) {
            return m.reply("❌ Upload failed.");
        }

        const url = data.data.url.replace(
            "tmpfiles.org/",
            "tmpfiles.org/dl/"
        );

        await m.reply(
`╭━━〔 🥶 *FREEZER-MD* 〕━━╮
┃
┃  ✅ *UPLOAD SUCCESS*
┃
┃  🔗 ${url}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {
        console.error("TOURL ERROR:", error);
        m.reply("❌ Upload failed. Try again.");
    }
});
