# 🥶 Freezer-MD

<p align="center">
  <b>Fast • Modular • Reliable WhatsApp Automation</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Freezer--MD-V1-111111?style=for-the-badge&logo=whatsapp&logoColor=white">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">
</p>

---

## ⚡ About

**Freezer-MD** is a modular WhatsApp bot built with **Node.js** and **Baileys**.

Designed for speed, customization, automation and easy plugin development.

### ✨ Features

* 🧩 Modular plugin system
* ⚡ Fast command handling
* 🔄 Reconnection support
* 🖼️ Media utilities
* 🗄️ SQLite support
* 🌐 Express integration
* 🚀 PM2 production support
* 🛠️ Easy configuration

---

## 📦 Installation

### Requirements

* Node.js 18+
* npm
* Git
* WhatsApp account

### Setup

```bash
git clone https://github.com/Freezerfred/Freezer-MD-.git
cd Freezer-MD-
npm install
npm start
```

Follow the authentication instructions displayed by the bot.

---

## ⚙️ Configuration

Main configuration:

```text
config.js
```

Keep API keys, tokens and session credentials private.

**Never commit secrets to GitHub.**

---

## 🧩 Plugins

Commands are located in:

```text
plugins/
```

Example:

```javascript
'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'hello',
    name: 'hello',
    description: 'Say hello',
    category: 'general',
    filename: __filename
}, async (sock, m) => {
    await m.reply('🥶 Hello from Freezer-MD!');
});
```

---

## 📋 Commands

Use:

```text
.menu
```

to view the available commands.

---

## 🚀 Production

Recommended:

**VPS + Node.js + PM2**

```bash
npm install -g pm2
pm2 start index.js --name Freezer-MD
pm2 save
pm2 startup
```

Check logs:

```bash
pm2 logs Freezer-MD
```

Restart:

```bash
pm2 restart Freezer-MD
```

---

## 🔄 Update

```bash
git pull
npm install
pm2 restart Freezer-MD
```

---

## 🛡️ Security

Never expose:

* Session credentials
* API keys
* Access tokens
* Database credentials

Keep sensitive files in `.gitignore`.

---

## 🗺️ Roadmap

### V1

* [x] Core WhatsApp system
* [x] Plugin architecture
* [x] Command system
* [x] Media utilities
* [x] Database support
* [x] Production support

### V2

* [ ] Advanced APIs
* [ ] More automation
* [ ] Advanced group tools
* [ ] Improved UI
* [ ] More developer tools

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch
3. Make your changes
4. Test
5. Submit a Pull Request

---

## ⚠️ Disclaimer

Freezer-MD is intended for educational and automation purposes.

Users are responsible for complying with WhatsApp's terms, applicable laws and third-party service policies.

---

## 📜 License

MIT License.

---

<p align="center">
  <b>🥶 FREEZER-MD</b><br>
  Build it. Freeze it. Run it.
</p>
