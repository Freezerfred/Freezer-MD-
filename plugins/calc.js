'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'calc',
    name: 'calc',
    category: 'Tools',
    description: 'Calculate mathematical expressions',
    aliases: ['calculate', 'math'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const expression = args.join(' ').trim();

        if (!expression) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🧮 *CALCULATOR*
┃
┃ Usage:
┃ .calc 25 * 4
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // Allow only safe mathematical characters
        if (!/^[0-9+\-*/%().\s]+$/.test(expression)) {
            return m.reply(
`❌ *Invalid expression.*

Only numbers and:
+  -  *  /  %  ( )`
            );
        }

        const result = Function(
            `"use strict"; return (${expression})`
        )();

        if (!Number.isFinite(result)) {
            throw new Error('Invalid calculation result');
        }

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🧮 *CALCULATION*
┃
┃ 📌 ${expression}
┃
┃ ✅ *RESULT:* ${result}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error('[FREEZER-MD] Calc Error:', error);

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Invalid calculation*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
