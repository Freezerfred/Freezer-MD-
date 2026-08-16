'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'autoFeatures.json');

const DEFAULTS = {
    autoRead: false,
    autoView: false,
    autoLike: false,
    presenceMode: 'none'
};

let settings = {
    ...DEFAULTS
};

// ========================================
// LOAD SETTINGS
// ========================================

function load() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        if (!fs.existsSync(DATA_FILE)) {
            save();
            return;
        }

        const data = JSON.parse(
            fs.readFileSync(DATA_FILE, 'utf8')
        );

        settings = {
            ...DEFAULTS,
            ...data
        };

    } catch (error) {
        console.error(
            '[AUTO-FEATURES] Failed to load settings:',
            error.message
        );

        settings = {
            ...DEFAULTS
        };
    }
}

// ========================================
// SAVE SETTINGS
// ========================================

function save() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(settings, null, 2)
        );

    } catch (error) {
        console.error(
            '[AUTO-FEATURES] Failed to save settings:',
            error.message
        );
    }
}

// ========================================
// GET STATUS
// ========================================

function getStatus() {
    return {
        ...settings
    };
}

// ========================================
// SET OPTION
// ========================================

function set(key, value) {

    const allowed = [
        'autoRead',
        'autoView',
        'autoLike',
        'presenceMode'
    ];

    if (!allowed.includes(key)) {
        throw new Error(`Invalid auto feature: ${key}`);
    }

    if (key === 'presenceMode') {
        const modes = [
            'none',
            'online',
            'typing',
            'recording'
        ];

        if (!modes.includes(value)) {
            throw new Error(`Invalid presence mode: ${value}`);
        }
    }

    settings[key] = value;

    save();

    return settings[key];
}

// ========================================
// RESET
// ========================================

function reset() {
    settings = {
        ...DEFAULTS
    };

    save();

    return settings;
}

// ========================================
// INITIALIZE
// ========================================

load();

module.exports = {
    getStatus,
    set,
    reset,
    load
};
