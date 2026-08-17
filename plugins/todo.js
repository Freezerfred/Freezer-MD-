'use strict';

const fs = require('fs');
const path = require('path');
const { cmd } = require('../arslan');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadTodos() {
    try {
        if (!fs.existsSync(DATA_FILE)) return {};
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
        return {};
    }
}

function saveTodos(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

cmd({
    pattern: 'todo',
    name: 'todo',
    category: 'Productivity',
    aliases: ['task', 'tasks'],
    description: 'Manage your personal tasks',
    tags: ['productivity'],
    filename: __filename
}, async (sock, m, args) => {

    try {
        const user = m.sender;
        const todos = loadTodos();

        if (!todos[user]) todos[user] = [];

        const action = (args[0] || '').toLowerCase();
        const text = args.slice(1).join(' ').trim();
        const prefix = global.BOT_PREFIX || '.';

        // ADD
        if (action === 'add') {

            if (!text) {
                return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 📝 *ADD TASK*
┃
┃ ${prefix}todo add <task>
┃
┃ Example:
┃ ${prefix}todo add Finish my project
┃
╰━━━━━━━━━━━━━━`
                );
            }

            todos[user].push({
                task: text,
                done: false,
                created: Date.now()
            });

            saveTodos(todos);

            const id = todos[user].length;

            return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ ✅ *TASK ADDED*
┃
┃ #${id} ${text}
┃
╰━━━━━━━━━━━━━━
> *Stay focused. Get it done.*`
            );
        }

        // LIST
        if (action === 'list' || !action) {

            if (!todos[user].length) {
                return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 📋 *YOUR TASKS*
┃
┃ No tasks yet.
┃
┃ Add one with:
┃ ${prefix}todo add <task>
┃
╰━━━━━━━━━━━━━━`
                );
            }

            const pending = todos[user].filter(t => !t.done).length;
            const completed = todos[user].filter(t => t.done).length;

            const list = todos[user]
                .map((t, i) =>
                    `┃ ${t.done ? '✅' : '⬜'} *${i + 1}.* ${t.task}`
                )
                .join('\n');

            return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 📋 *MY TASKS*
┃
${list}
┃
┃ ─────────────────
┃ ⏳ Pending: ${pending}
┃ ✅ Done: ${completed}
┃
╰━━━━━━━━━━━━━━`
            );
        }

        // DONE
        if (action === 'done') {

            const id = Number(args[1]);

            if (!id || !todos[user][id - 1]) {
                return m.reply(`❌ Invalid task number.\n\nExample: ${prefix}todo done 1`);
            }

            todos[user][id - 1].done = true;
            saveTodos(todos);

            return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ ✅ *TASK COMPLETED*
┃
┃ ${todos[user][id - 1].task}
┃
╰━━━━━━━━━━━━━━
> *One step closer.*`
            );
        }

        // DELETE
        if (action === 'delete' || action === 'del') {

            const id = Number(args[1]);

            if (!id || !todos[user][id - 1]) {
                return m.reply(`❌ Invalid task number.\n\nExample: ${prefix}todo delete 1`);
            }

            const removed = todos[user].splice(id - 1, 1)[0];
            saveTodos(todos);

            return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 🗑️ *TASK DELETED*
┃
┃ ${removed.task}
┃
╰━━━━━━━━━━━━━━`
            );
        }

        // CLEAR
        if (action === 'clear') {

            todos[user] = [];
            saveTodos(todos);

            return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 🧹 *TASK LIST CLEARED*
┃
┃ Your productivity list is empty.
┃
╰━━━━━━━━━━━━━━`
            );
        }

        return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ ⚡ *TODO MANAGER*
┃
┃ ${prefix}todo add <task>
┃ ${prefix}todo list
┃ ${prefix}todo done <id>
┃ ${prefix}todo delete <id>
┃ ${prefix}todo clear
┃
╰━━━━━━━━━━━━━━`
        );

    } catch (err) {

        console.error('Freezer Todo Error:', err);

        return m.reply(
`❌ *FREEZER-MD*

Something went wrong while
managing your tasks.`
        );
    }
});
