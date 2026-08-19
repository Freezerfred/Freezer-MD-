# 🥶 FREEZER-MD

> **A powerful, modular WhatsApp bot built with Baileys.**

Freezer-MD is a feature-rich WhatsApp bot designed for **speed, automation, group management, media tools, utilities, and customization**.

Built for users who want a clean, powerful and expandable WhatsApp automation system.

---

## ⚡ Features

### 🤖 Core

* Fast command handler
* Plugin-based architecture
* Custom command prefix
* Auto plugin loading
* Command aliases
* Owner & developer permissions
* Error-safe command execution

### 👥 Group Management

* Group administration tools
* Admin checking
* Bot-admin checking
* Group owner checking
* Welcome system
* Group protection
* Group information
* Participant management

### 🛠️ Tools

* Media downloading
* Media conversion
* URL tools
* File utilities
* Image tools
* Sticker tools
* QR utilities
* System utilities

### 🛡️ Security

* Anti-delete
* Owner-only commands
* Developer commands
* Permission protection
* Session protection
* Configurable security features

### 📡 Automation

* Auto-read
* Auto-view
* Auto-like
* Status automation
* Auto reactions
* Configurable presence

### 🎨 Customization

* Custom bot name
* Custom prefix
* Custom menu image
* Custom owner name
* Custom WhatsApp channel
* Modular plugins
* Easy configuration

---

## 📁 Project Structure

```text
Freezer-MD/
├── index.js
├── handler.js
├── arslan.js
├── config.js
├── package.json
├── app.json
│
├── lib/
│   ├── sessionLoader.js
│   ├── autoFeature.js
│   └── ...
│
├── plugins/
│   ├── General/
│   ├── Admin/
│   ├── Group/
│   ├── Owner/
│   ├── Tools/
│   ├── Security/
│   ├── Channel/
│   └── ...
│
├── data/
├── session/
└── README.md
```

---

## 📦 Requirements

Before installing Freezer-MD, make sure you have:

* Node.js 18+
* Git
* FFmpeg
* A WhatsApp account
* A valid Freezer-MD session ID

Node.js **20 LTS or newer** is recommended.

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Freezerfred/Freezer-MD-.git
cd Freezer-MD-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
SESSION_ID=YOUR_SESSION_ID
BOT_NAME=FREEZER-MD
BOT_PREFIX=.
OWNER_NAME=🥶 Freezer 🥶
CHANNEL_URL=https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U
CHANNEL_NAME=❄️ FREEZER-MD OFFICIAL ❄️
```

**Never publish your real `SESSION_ID` or private credentials.**

### 4. Start the bot

```bash
npm start
```

---

## ⚙️ Configuration

Freezer-MD uses environment variables and `config.js` for configuration.

Common settings include:

| Setting        | Description                     |
| -------------- | ------------------------------- |
| `SESSION_ID`   | WhatsApp authentication session |
| `BOT_NAME`     | Bot display name                |
| `BOT_PREFIX`   | Command prefix                  |
| `OWNER_NAME`   | Owner display name              |
| `CHANNEL_URL`  | Official WhatsApp channel       |
| `CHANNEL_NAME` | Channel display name            |

Example:

```env
BOT_NAME=FREEZER-MD
BOT_PREFIX=.
OWNER_NAME=🥶 Freezer 🥶
```

---

## 🎮 Commands

The default prefix is:

```text
.
```

Examples:

```text
.ping
.alive
.menu
.uptime
```

Your installed plugins determine the available commands.

Use:

```text
.menu
```

to view the commands available on your installation.

---

## 🔌 Plugin System

Freezer-MD uses a modular plugin architecture.

A plugin can register:

* Command name
* Aliases
* Category
* Description
* Permission requirements
* Command handler

Example:

```js
const { cmd } = require('../arslan');

cmd({
    pattern: 'hello',
    name: 'hello',
    category: 'General',
    aliases: ['hi'],
    description: 'Say hello',
    filename: __filename
}, async (sock, m) => {

    await m.reply('🥶 Hello from Freezer-MD!');
});
```

Place the plugin inside the appropriate `plugins/` directory.

Restart the bot after adding a plugin if automatic plugin loading is not enabled.

---

## 🛡️ Security

**Do not commit sensitive information to GitHub.**

Never upload:

```text
.env
session/
creds.json
auth_info/
private keys
API keys
tokens
```

Make sure your `.gitignore` contains sensitive files before publishing.

If a session or API key is accidentally exposed, revoke or regenerate it immediately.

---

## 🌐 Official Repository

[Freezer-MD on GitHub](https://github.com/Freezerfred/Freezer-MD-?utm_source=chatgpt.com)

---

## 📢 Official Channel

[FREEZER-MD Official WhatsApp Channel](https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U?utm_source=chatgpt.com)

Follow the official channel for:

* Updates
* New plugins
* Releases
* Fixes
* Announcements

---

## 🧩 Development

Freezer-MD is designed to be extended.

You can create your own:

* Commands
* Group tools
* Media tools
* Automation systems
* Security plugins
* Admin tools
* Fun commands
* API integrations

Keep plugins modular and avoid modifying the core unless necessary.

---

## 🐛 Reporting Bugs

When reporting a bug, include:

1. Freezer-MD version
2. Node.js version
3. Command that caused the problem
4. Full terminal error
5. Relevant plugin
6. Steps required to reproduce the issue

**Never post your session ID, credentials, API keys or private information.**

---

## 🤝 Contributions

Contributions are welcome.

Before submitting changes:

* Test the bot
* Check for duplicate commands
* Check for broken imports
* Keep the existing architecture
* Avoid exposing credentials
* Keep branding consistent
* Explain major changes

---

## 📜 License

Freezer-MD is released under the **MIT License**.

See the `LICENSE` file for details.

---

## 🥶 Credits

**Freezer-MD**

Built and maintained by **Freezer**.

> **Code it. Freeze it. Run it. 🥶**

---

### ⭐ Support the Project

If Freezer-MD is useful to you:

⭐ Star the repository
🍴 Fork the project
🐛 Report bugs
💡 Suggest improvements
🔌 Build plugins

**FREEZER-MD — BUILT TO RUN. 🥶**
