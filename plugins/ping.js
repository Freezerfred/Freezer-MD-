const { cmd } = require('../arslan');

cmd({
    pattern: "ping",
    name: "ping",
    category: "General",
    description: "Check bot latency",
    aliases: ["p"],
    command: /^\.?(ping|p)$/i,
    filename: __filename
}, async (sock, m) => {
    const start = process.hrtime.bigint();

    const sent = await sock.sendMessage(
        m.chat,
        { text: "🏓 *Pinging...*" },
        { quoted: m }
    );

    const latency = Number(process.hrtime.bigint() - start) / 1e6;

    await sock.sendMessage(
        m.chat,
        {
            text: `🏓 *PONG!*

⚡ ${latency.toFixed(2)} ms
🤖 *Freezer-MD • Online*`
        },
        { quoted: sent }
    );
});
