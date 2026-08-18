'use strict';

const axios = require('axios');
const fs = require('fs');

const { cmd } = require('../arslan');

cmd({
    pattern: 'repo',
    name: 'repo',
    category: 'General',
    aliases: ['sourcecode', 'script', 'sc', 'github'],
    description: 'Show live Freezer-MD GitHub information',
    filename: __filename
}, async (sock, m, args) => {

    // ─────────────────────────────────────────────
    // FREEZER-MD REPOSITORY
    // ─────────────────────────────────────────────

    const REPO_OWNER = 'Freezerfred';
    const REPO_NAME = 'Freezer-MD-';

    const REPO_URL =
        `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

    const API_URL =
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

    // ─────────────────────────────────────────────
    // DEFAULT REPOSITORY DATA
    // ─────────────────────────────────────────────

    let stats = {
        description:
            'A modern WhatsApp bot built on Baileys.',

        stars: '—',
        forks: '—',
        watchers: '—',
        issues: '—',
        language: 'JavaScript',
        license: 'MIT',
        updated: 'N/A',
        branch: 'main'
    };

    // ─────────────────────────────────────────────
    // LIVE GITHUB INFORMATION
    // ─────────────────────────────────────────────

    try {

        const response = await fetch(API_URL, {
            headers: {
                'User-Agent': 'Freezer-MD',
                'Accept': 'application/vnd.github+json'
            }
        });

        if (response.ok) {

            const data = await response.json();

            stats = {
                description:
                    data.description ||
                    stats.description,

                stars:
                    data.stargazers_count ??
                    stats.stars,

                forks:
                    data.forks_count ??
                    stats.forks,

                watchers:
                    data.watchers_count ??
                    stats.watchers,

                issues:
                    data.open_issues_count ??
                    stats.issues,

                language:
                    data.language ||
                    stats.language,

                license:
                    data.license?.spdx_id ||
                    data.license?.name ||
                    stats.license,

                updated:
                    data.pushed_at
                        ? new Date(
                            data.pushed_at
                        ).toLocaleString(
                            'en-GB',
                            {
                                timeZone:
                                    'Africa/Nairobi'
                            }
                        )
                        : stats.updated,

                branch:
                    data.default_branch ||
                    stats.branch
            };
        }

    } catch (error) {

        console.error(
            '[FREEZER-MD] GitHub API Error:',
            error.message
        );
    }

    // ─────────────────────────────────────────────
    // PROFESSIONAL FREEZER-MD DESIGN
    // ─────────────────────────────────────────────

    const info =
`╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗* ❄️
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 📦 *SOURCE CODE*
┃ Freezer-MD
┃
┃ 📝 *DESCRIPTION*
┃ ${stats.description}
┃
┃ 🔗 *REPOSITORY*
┃ ${REPO_URL}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ⭐ *Stars*     : ${stats.stars}
┃ 🍴 *Forks*     : ${stats.forks}
┃ 👁️ *Watchers*  : ${stats.watchers}
┃ 🐛 *Issues*    : ${stats.issues}
┃ 💻 *Language*  : ${stats.language}
┃ 📄 *License*   : ${stats.license}
┃ 🌿 *Branch*    : ${stats.branch}
┃ 🕒 *Updated*   : ${stats.updated}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
> *𝗙𝗔𝗦𝗧 • 𝗦𝗧𝗔𝗕𝗟𝗘 • 𝗣𝗢𝗪𝗘𝗥𝗙𝗨𝗟*
> *𝗕𝗨𝗜𝗟𝗧 𝗗𝗜𝗙𝗙𝗘𝗥𝗘𝗡𝗧.*`;

    // ─────────────────────────────────────────────
    // SEND REPOSITORY IMAGE
    // ─────────────────────────────────────────────

    try {

        if (!global.menuImage) {
            throw new Error(
                'global.menuImage is not set'
            );
        }

        const imageBuffer =
            /^https?:\/\//i.test(
                global.menuImage
            )

                ? (
                    await axios.get(
                        global.menuImage,
                        {
                            responseType:
                                'arraybuffer',
                            timeout: 8000
                        }
                    )
                ).data

                : fs.readFileSync(
                    global.menuImage
                );

        await m.reply(
            imageBuffer,
            {
                caption: info
            }
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Repo image error:',
            error.message
        );

        // Text fallback
        try {

            await sock.sendMessage(
                m.from,
                {
                    text: info
                }
            );

        } catch (fallbackError) {

            console.error(
                '[FREEZER-MD] Repo fallback error:',
                fallbackError.message
            );
        }
    }
});

