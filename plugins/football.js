const { cmd } = require('../arslan');
const axios = require('axios');
const NodeCache = require('node-cache');

// ---------------------- CONFIGURATION ----------------------
const API_KEY = process.env.FOOTBALL_API_KEY || '919d60c7f36f46589bc502c0e3e49b50';
const BASE_URL = 'https://api.football-data.org/v4';

const LEAGUES = {
    'PL': 'Premier League',
    'PD': 'La Liga',
    'BL1': 'Bundesliga',
    'SA': 'Serie A',
    'FL1': 'Ligue 1',
    'CL': 'UEFA Champions League',
    'EL': 'UEFA Europa League',
    'WC': 'FIFA World Cup',
    'EC': 'UEFA European Championship'
};

const cache = new NodeCache({ stdTTL: 600 });

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getLeagueName(code) {
    return LEAGUES[code] || code || 'Unknown League';
}

async function fetchFromAPI(endpoint) {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`API Error ${error.response.status}: ${error.response.data.message || error.response.statusText}`);
        }
        throw new Error(error.message || 'Failed to fetch data');
    }
}

async function getTeamsForLeague(leagueCode) {
    const cacheKey = `teams_${leagueCode}`;
    let teams = cache.get(cacheKey);
    if (!teams) {
        const data = await fetchFromAPI(`/competitions/${leagueCode}/teams`);
        teams = data.teams || [];
        cache.set(cacheKey, teams);
    }
    return teams;
}

function findTeam(teams, searchName) {
    const normalized = searchName.toLowerCase().trim();
    let found = teams.find(t => t.name.toLowerCase() === normalized);
    if (found) return found;
    found = teams.find(t => t.name.toLowerCase().startsWith(normalized));
    if (found) return found;
    found = teams.find(t => t.name.toLowerCase().includes(normalized));
    return found || null;
}

// ===================== COMMANDS =====================
// All commands: livescore, standings, fixtures, scorers, team, matchinfo, football

cmd({
    pattern: 'livescore',
    alias: ['live', 'score', 'scores'],
    desc: 'Get live football scores (filter by league)',
    category: 'football',
    use: '.livescore [league_code]',
    filename: __filename
}, async (sock, m, text) => {
    try {
        await sock.sendPresenceUpdate('composing', m.chat);
        const leagueCode = text ? text.trim().toUpperCase() : null;
        const data = await fetchFromAPI('/matches');
        const matches = data.matches || [];
        const liveMatches = matches.filter(m => ['LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status));
        const filtered = leagueCode ? liveMatches.filter(m => m.competition?.code === leagueCode) : liveMatches;
        if (filtered.length === 0) {
            const msg = leagueCode ? `⚽ No live matches in ${getLeagueName(leagueCode)} right now.` : '⚽ No live matches at the moment.';
            return await m.reply(msg);
        }
        let response = '⚽ *LIVE SCORES* ⚽\n' + '─'.repeat(30) + '\n\n';
        filtered.forEach(m => {
            const home = m.homeTeam?.name || 'TBD';
            const away = m.awayTeam?.name || 'TBD';
            const scoreHome = m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? '-';
            const scoreAway = m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? '-';
            const league = getLeagueName(m.competition?.code);
            const minute = m.minute || '??';
            response += `🏆 *${league}*\n🕐 ${minute}'\n🔴 ${home} ${scoreHome} - ${scoreAway} ${away}\n─`.repeat(25) + '\n';
        });
        await m.reply(response);
    } catch (error) {
        console.error('Livescore error:', error);
        await m.reply(`❌ ${error.message}`);
    }
});

cmd({
    pattern: 'standings',
    alias: ['table', 'league', 'standing'],
    desc: 'Get league standings/table',
    category: 'football',
    use: '.standings <league_code>',
    filename: __filename
}, async (sock, m, text) => {
    if (!text) return await m.reply(`❌ Provide league code.\nAvailable: ${Object.keys(LEAGUES).join(', ')}`);
    const leagueCode = text.trim().toUpperCase();
    if (!LEAGUES[leagueCode]) return await m.reply(`❌ Invalid code. Use: ${Object.keys(LEAGUES).join(', ')}`);
    try {
        await sock.sendPresenceUpdate('composing', m.chat);
        const data = await fetchFromAPI(`/competitions/${leagueCode}/standings`);
        const standings = data.standings?.[0]?.table || [];
        if (standings.length === 0) return await m.reply(`❌ No standings for ${getLeagueName(leagueCode)}.`);
        let response = `🏆 *${getLeagueName(leagueCode)} STANDINGS* 🏆\n─`.repeat(35) + '\n\n';
        standings.slice(0, 10).forEach((team, index) => {
            const pos = index + 1;
            const name = team.team?.name || 'Unknown';
            const p = team.playedGames || 0, w = team.won || 0, d = team.draw || 0, l = team.lost || 0;
            const pts = team.points || 0, gd = team.goalDifference || 0;
            const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `${pos}.`;
            response += `${medal} *${name}*\n   P:${p} W:${w} D:${d} L:${l} GD:${gd} PTS:${pts}\n\n`;
        });
        await m.reply(response);
    } catch (error) {
        console.error('Standings error:', error);
        await m.reply(`❌ ${error.message}`);
    }
});

cmd({
    pattern: 'fixtures',
    alias: ['fixture', 'matches', 'schedule'],
    desc: 'Get upcoming fixtures (with Match ID for .matchinfo)',
    category: 'football',
    use: '.fixtures <league_code>',
    filename: __filename
}, async (sock, m, text) => {
    if (!text) return await m.reply(`❌ Provide league code.\nAvailable: ${Object.keys(LEAGUES).join(', ')}`);
    const leagueCode = text.trim().toUpperCase();
    if (!LEAGUES[leagueCode]) return await m.reply(`❌ Invalid code. Use: ${Object.keys(LEAGUES).join(', ')}`);
    try {
        await sock.sendPresenceUpdate('composing', m.chat);
        const data = await fetchFromAPI(`/competitions/${leagueCode}/matches`);
        const upcoming = (data.matches || []).filter(m => ['SCHEDULED', 'TIMED'].includes(m.status)).slice(0, 10);
        if (upcoming.length === 0) return await m.reply(`❌ No upcoming fixtures for ${getLeagueName(leagueCode)}.`);
        let response = `📅 *${getLeagueName(leagueCode)} FIXTURES* 📅\n─`.repeat(35) + '\n\n';
        upcoming.forEach(m => {
            const home = m.homeTeam?.name || 'TBD';
            const away = m.awayTeam?.name || 'TBD';
            response += `⚔️ ${home} vs ${away}\n📆 ${formatDate(m.utcDate)}\n📍 ${m.stage || 'Matchday'}\n📌 ID: ${m.id}\n─`.repeat(25) + '\n';
        });
        await m.reply(response);
    } catch (error) {
        console.error('Fixtures error:', error);
        await m.reply(`❌ ${error.message}`);
    }
});

cmd({
    pattern: 'scorers',
    alias: ['topscorers', 'goals', 'topscorer'],
    desc: 'Get top scorers for a league',
    category: 'football',
    use: '.scorers <league_code>',
    filename: __filename
}, async (sock, m, text) => {
    if (!text) return await m.reply(`❌ Provide league code.\nAvailable: ${Object.keys(LEAGUES).join(', ')}`);
    const leagueCode = text.trim().toUpperCase();
    if (!LEAGUES[leagueCode]) return await m.reply(`❌ Invalid code. Use: ${Object.keys(LEAGUES).join(', ')}`);
    try {
        await sock.sendPresenceUpdate('composing', m.chat);
        const data = await fetchFromAPI(`/competitions/${leagueCode}/scorers`);
        const scorers = data.scorers || [];
        if (scorers.length === 0) return await m.reply(`❌ No scorer data for ${getLeagueName(leagueCode)}.`);
        let response = `⚽ *${getLeagueName(leagueCode)} TOP SCORERS* ⚽\n─`.repeat(35) + '\n\n';
        scorers.slice(0, 10).forEach((s, i) => {
            const name = s.player?.name || 'Unknown';
            const team = s.team?.name || 'Unknown';
            const goals = s.goals || 0;
            const assists = s.assists || 0;
            const pens = s.penalties || 0;
            response += `${i+1}. *${name}* (${team})\n   ⚽ ${goals} goals${assists > 0 ? `, 🅰️ ${assists} assists` : ''}${pens > 0 ? `, ⚪ ${pens} pen.` : ''}\n\n`;
        });
        await m.reply(response);
    } catch (error) {
        console.error('Scorers error:', error);
        await m.reply(`❌ ${error.message}`);
    }
});

cmd({
    pattern: 'team',
    alias: ['teaminfo', 'club'],
    desc: 'Get detailed info about a team (stadium, coach, squad)',
    category: 'football',
    use: '.team <league_code> <team_name>\nExample: .team PL Arsenal',
    filename: __filename
}, async (sock, m, text) => {
    if (!text) return await m.reply(`❌ Usage: .team <league_code> <team_name>\nExample: .team PL Arsenal`);
    const parts = text.trim().split(/\s+/);
    if (parts.length < 2) return await m.reply(`❌ Provide both league and team name.\nExample: .team PL Arsenal`);
    const leagueCode = parts[0].toUpperCase();
    const teamName = parts.slice(1).join(' ');
    if (!LEAGUES[leagueCode]) return await m.reply(`❌ Invalid league code. Use: ${Object.keys(LEAGUES).join(', ')}`);
    try {
        await sock.sendPresenceUpdate('composing', m.chat);
        const teams = await getTeamsForLeague(leagueCode);
        const team = findTeam(teams, teamName);
        if (!team) return await m.reply(`❌ Team "${teamName}" not found in ${getLeagueName(leagueCode)}.`);
        const teamData = await fetchFromAPI(`/teams/${team.id}`);
        let response = `🏛️ *${teamData.name}* (${teamData.tla || 'N/A'})\n─`.repeat(30) + '\n';
        response += `📍 *Stadium:* ${teamData.venue || 'N/A'}\n🏷️ *Founded:* ${teamData.founded || 'N/A'}\n🌍 *Country:* ${teamData.area?.name || 'N/A'}\n🎨 *Colors:* ${teamData.clubColors || 'N/A'}\n👨‍🏫 *Coach:* ${teamData.coach?.name || 'N/A'} (${teamData.coach?.nationality || 'N/A'})\n`;
        const squad = teamData.squad || [];
        if (squad.length > 0) {
            response += `\n🧑‍🤝‍🧑 *Squad (first 11):*\n`;
            response += squad.slice(0, 11).map(p => `  • ${p.name} (${p.position || 'N/A'})`).join('\n');
            if (squad.length > 11) response += `\n  ... and ${squad.length - 11} more`;
        }
        await m.reply(response);
    } catch (error) {
        console.error('Team error:', error);
        await m.reply(`❌ ${error.message}`);
    }
});

cmd({
    pattern: 'matchinfo',
    alias: ['match', 'matchstats', 'md'],
    desc: 'Get detailed stats for a specific match (use ID from .fixtures)',
    category: 'football',
    use: '.matchinfo <match_id>\nExample: .matchinfo 123456',
    filename: __filename
}, async (sock, m, text) => {
    if (!text) return await m.reply(`❌ Provide a Match ID.\nGet it from .fixtures command.`);
    const matchId = text.trim();
    if (!/^\d+$/.test(matchId)) return await m.reply('❌ Match ID must be a number.');
    try {
        await sock.sendPresenceUpdate('composing', m.chat);
        const data = await fetchFromAPI(`/matches/${matchId}`);
        const home = data.homeTeam?.name || 'TBD';
        const away = data.awayTeam?.name || 'TBD';
        const competition = getLeagueName(data.competition?.code);
        const status = data.status || 'UNKNOWN';
        const ft = data.score?.fullTime || { home: null, away: null };
        const ht = data.score?.halfTime || { home: null, away: null };
        let response = `📊 *${home} vs ${away}* 📊\n🏆 ${competition}\n🕐 Status: ${status}\n─`.repeat(30) + '\n';
        if (ft.home !== null && ft.away !== null) response += `⚽ Full-time: ${home} ${ft.home} - ${ft.away} ${away}\n`;
        if (ht.home !== null && ht.away !== null) response += `⏱️ Half-time: ${home} ${ht.home} - ${ht.away} ${away}\n`;
        const stats = data.stats || [];
        if (stats.length > 0) {
            response += `\n📈 Match Stats:\n`;
            stats.forEach(stat => {
                response += `  • ${stat.type || 'Stat'}: ${stat.homeValue ?? '—'} - ${stat.awayValue ?? '—'}\n`;
            });
        }
        const refs = data.referees || [];
        if (refs.length > 0) response += `\n👨‍⚖️ Referees:\n  • ${refs.map(r => `${r.name} (${r.role || 'N/A'})`).join('\n  • ')}`;
        if (data.venue) response += `\n📍 Venue: ${data.venue}`;
        await m.reply(response);
    } catch (error) {
        console.error('Match info error:', error);
        await m.reply(`❌ ${error.message}`);
    }
});

cmd({
    pattern: 'football',
    alias: ['futbol', 'soccer'],
    desc: 'Show all football commands',
    category: 'football',
    use: '.football',
    filename: __filename
}, async (sock, m) => {
    await m.reply(`⚽ *FOOTBALL COMMANDS* ⚽
─────────────────────
📌 .livescore [code]  → Live scores
📋 .standings <code>  → League table
📅 .fixtures <code>   → Upcoming fixtures (shows Match IDs)
🥅 .scorers <code>    → Top goal scorers
🏛️ .team <code> <name> → Club info & squad
📊 .matchinfo <id>    → Full match stats

─────────────────────
League codes: ${Object.keys(LEAGUES).join(', ')}
─────────────────────
ℹ️ Free API provided by football-data.org`);
});
