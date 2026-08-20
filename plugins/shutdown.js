'use strict';
const { cmd } = require('../arslan');

cmd({
    pattern: 'shutdown',
    name: 'shutdown',
    category: 'Owner',
    aliases: ['stop'],
    description: 'Shut down the Freezer-MD process',
    filename: __filename
}, async (sock, m) => {
    if (!m.isOwner) return m.reply('❌ Owner access required.');
    await m.reply('❄️ *FREEZER-MD*\n\n🛑 Shutting down...');
    setTimeout(() => process.exit(0), 1000);
});
