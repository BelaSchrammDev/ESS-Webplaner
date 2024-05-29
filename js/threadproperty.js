const LDBOHR_INVALID = '---';

const TYPE_ARRAY = [
    { type: 'NPSM', matches: ['NPSM'], extractPropertyFunction: extractPropertysUnknow },
    { type: 'VG', matches: ['VG'], extractPropertyFunction: extractPropertysUnknow },
    { type: 'BS', matches: ['BSF', 'BSW', 'BSC'], extractPropertyFunction: extractPropertysUN },
    { type: 'UN', matches: ['NGO', 'UNJEF', 'UNJC', 'UNEF', 'UNJF', 'UNJ', 'UNF', 'UNS', 'UNR', 'UNC', 'UN'], extractPropertyFunction: extractPropertysUN },
    { type: 'Tr', matches: ['Tr', 'TR'], extractPropertyFunction: extractPropertysTrM },
    { type: 'M', matches: ['MJ', 'Mj', 'M'], extractPropertyFunction: extractPropertysTrM },
    { type: 'R', matches: ['R'], extractPropertyFunction: extractPropertysRG },
    { type: 'G', matches: ['G'], extractPropertyFunction: extractPropertysRG },
    { type: 'W', matches: ['W'], extractPropertyFunction: extractPropertysW },
    { type: 'Pg', matches: ['Pg'], extractPropertyFunction: extractPropertysUnknow },
];

const LAEPPBOHR_ARRAY = [
    { type: 'NPSM', func: null },
    { type: 'VG', func: null },
    { type: 'BS', func: getLaeppBohrDurchmesserUni },
    { type: 'UN', func: getLaeppBohrDurchmesserUni },
    { type: 'Tr', func: null },
    { type: 'M', func: getLaeppBohrDurchmesserUni },
    { type: 'R', func: getLaeppBohrDurchmesserUni },
    { type: 'G', func: getLaeppBohrDurchmesserUni },
    { type: 'W', func: getLaeppBohrDurchmesserUni },
    { type: 'Pg', func: null },
];


const threatMregular_Pitch = {
    4: 0.7,
    4.5: 0.75,
    5: 0.8,
    6: 1,
    7: 1,
    8: 1.25,
    9: 1.25,
    10: 1.5,
    11: 1.5,
    12: 1.75,
    14: 2,
    16: 2,
    18: 2.5,
    20: 2.5,
    22: 2.5,
    24: 3,
    27: 3,
    30: 3.5,
    33: 3.5,
    36: 4,
    39: 4,
}


const threatsRG = {
    "1/16": {
        "diameter": 6.84,
        "pitch": 0.907
    },
    "1/8": {
        "diameter": 9.73,
        "pitch": 0.907
    },
    "1/4": {
        "diameter": 13.16,
        "pitch": 1.337
    },
    "3/8": {
        "diameter": 16.66,
        "pitch": 1.337
    },
    "1/2": {
        "diameter": 20.95,
        "pitch": 1.814
    },
    "5/8": {
        "diameter": 22.91,
        "pitch": 1.814
    },
    "3/4": {
        "diameter": 26.44,
        "pitch": 1.814
    },
    "7/8": {
        "diameter": 30.20,
        "pitch": 1.814
    },
    "1": {
        "diameter": 33.25,
        "pitch": 2.309
    },
    "1 1/8": {
        "diameter": 37.897,
        "pitch": 2.309
    },
    "1 1/2": {
        "diameter": 48.000,
        "pitch": 2.309
    },
}


/**
 * Returns a substring of the given text up to the first occurrence of a whitespace or hyphen character.
 *
 * @param {string} text - The input text.
 * @returns {string} The substring of the input text.
 */
function getSubstrHS(text) {
    let input = text.trim();
    let pos = input.search(/[\s-]/);
    if (pos == -1) return input;
    return input.substring(0, pos);
}


/**
 * Returns a substring of the input text excluding the characters after the first occurrence of '-'.
 *
 * @param {string} text - The input text.
 * @returns {string} - The substring of the input text.
 */
function getSubstrMinus(text) {
    let input = text.trim();
    let pos = input.search(/[-]/);
    if (pos == -1) return input;
    return input.substring(0, pos);
}


/**
 * Returns a substring of the input text up to the first occurrence of 'x'.
 * If 'x' is not found, returns the entire input text.
 *
 * @param {string} text - The input text.
 * @returns {string} The substring of the input text.
 */
function getSubstrX(text) {
    let input = text.trim();
    let pos = input.search(/[x]/);
    if (pos == -1) return input;
    return input.substring(0, pos);
}


/**
 * analyzed and calculate the property of the thread
 * still to implement: Pg, Fg, NPSM
 * 
 * @param {string} abmessung string with thread description
 * @returns {{type: string, diameter: Number, pitch: Number}} JSON with propertys type, diameter and pitch
 */
function extractThreadPropertys(abmessung) {
    let threadPropertys = { type: '???' };
    const clearedAbmessung = clearUnusedChars(abmessung);
    for (let index = 0; index < TYPE_ARRAY.length; index++) {
        const typeObject = TYPE_ARRAY[index];
        for (let j = 0; j < typeObject.matches.length; j++) {
            if (clearedAbmessung.includes(typeObject.matches[j])) {
                const adjustAbmessung = clearedAbmessung.replace(typeObject.matches[j], '').trim();
                threadPropertys.type = typeObject.type;
                typeObject.extractPropertyFunction(adjustAbmessung, threadPropertys);
                return threadPropertys;
            }
        }
    }
    extractPropertysUnknow(clearedAbmessung, threadPropertys);
    return threadPropertys;
}


/**
 * Removes the unused characters from the given `abmessung` string.
 * 
 * @param {string} abmessung - The input string from which unused characters need to be removed.
 * @returns {string} The `abmessung` string with unused characters removed.
 */
function clearUnusedChars(abmessung) {
    const CLEAR_CHARS = ['GR', 'AR', 'LH'];
    let clearedAbmessung = abmessung;
    CLEAR_CHARS.forEach(char => clearedAbmessung = clearedAbmessung.replace(char, ''));
    return clearedAbmessung.trim();
}


/**
 * Replaces characters in a string based on the provided character array.
 *
 * @param {string} str - The input string to be modified.
 * @param {Array<{ from: string, to: string }>} charArray - The array of character replacements.
 * @returns {string} The modified string after replacing the characters.
 */
function replaceCharArray(str, charArray) {
    for (let i = 0; i < charArray.length; i++) {
        str = str.replaceAll(charArray[i].from, charArray[i].to);
    }
    return str;
}

/**
 * set the thread properties to unknown.
 * For Unknown Threadtypes
 * 
 * @param {string} propertyString - The property string containing unknown properties.
 * @param {object} propertyObject - The object to assign the extracted properties to.
 * @returns {void}
 */
function extractPropertysUnknow(propertyString, propertyObject) {
    propertyObject.diameter = '??';
    propertyObject.pitch = '??';
}


/**
 * Extracts properties from a given property string and updates the property object.
 * For Threadtype W
 *
 * @param {string} propertyString - The property string to extract properties from.
 * @param {object} propertyObject - The object to update with extracted properties.
 */
function extractPropertysW(propertyString, propertyObject) {
    let adjustpropertyString = replaceCharArray(propertyString, [
        { from: ',', to: '.' },
        { from: 'X1/', to: '-' },
        { from: 'x1/', to: '-' },
        { from: 'X', to: '-' },
        { from: 'x', to: '-' },
    ]);
    extractPropertysUN(adjustpropertyString, propertyObject);
}


/**
 * Extracts properties from a given property string and updates the property object.
 * For Threadtype Tr and M.
 *
 * @param {string} propertyString - The property string to extract properties from.
 * @param {object} propertyObject - The object to update with extracted properties.
 */
function extractPropertysTrM(propertyString, propertyObject) {
    let propertys = replaceCharArray(propertyString, [
        { from: ',', to: '.' },
        { from: 'SK', to: '' },
        { from: 'Sk', to: '' },
    ]);
    if (propertys.includes('x')) {
        propertyObject.diameter = getSubstrX(propertys);
        propertyObject.pitch = getSubstrHS(propertys.substring(propertys.indexOf('x') + 1));
    }
    else if (propertyObject.type == 'M') {
        let propertySubString = getSubstrHS(propertys);
        propertyObject.diameter = propertySubString;
        if (threatMregular_Pitch[propertySubString]) propertyObject.pitch = threatMregular_Pitch[propertySubString];
        else propertyObject.pitch = '-?-';
    }
}


/**
 * Extracts properties from a given property string and updates the property object.
 * For Threadtype UN and BS
 *
 * @param {string} propertyString - The property string to extract properties from.
 * @param {object} propertyObject - The object to update with extracted properties.
 */
function extractPropertysUN(propertyString, propertyObject) {
    let propertySubString = getSubstrMinus(propertyString);
    if (propertySubString.includes('/')) {
        let factors = propertySubString.trim().split('/');
        if (factors.length > 1) {
            let bigFactor = 0;
            if (factors[0].includes(' ')) {
                bigFactor = +factors[0].split(' ')[0] * 25.4;
                factors[0] = factors[0].split(' ')[1];
            }
            propertyObject.diameterFull = bigFactor + ((25.4 / factors[1]) * factors[0]);
            propertyObject.diameter = propertyObject.diameterFull.toFixed(2);
        }
    }
    else if (+propertySubString > 20) {
        propertyObject.diameter = (parseFloat(propertySubString)).toFixed(2);
    }
    else if (propertySubString.includes('.')) {
        let result = (25.4 * parseFloat(propertySubString)).toFixed(2);
        propertyObject.diameter = result > 40 ? result / 25.4 : result;
    }
    else if (propertyObject.type == 'UN') {
        const propertyValues = [
            { '8': 4.1 },
            { '10': 4.8 },
            { '1': 25.4 },
            { '12': 5.48 },
        ]
        for (let i = 0; i < propertyValues.length; i++) {
            if (propertyValues[i][propertySubString]) {
                propertyObject.diameter = propertyValues[i][propertySubString];
                break;
            }
        }
    }
    if (propertyObject.diameter != '??') {
        propertySubString = +getSubstrHS(propertyString.substring(propertyString.indexOf('-') + 1));
        if (propertySubString > 5) propertyObject.pitch = (25.4 / propertySubString).toFixed(4);
        else propertyObject.pitch = (propertySubString).toFixed(4);
    }
}


/**
 * Extracts properties from a given property string and updates the property object.
 * For Threadtype R and G
 *
 * @param {string} propertyString - The property string to extract properties from.
 * @param {object} propertyObject - The object to update with extracted properties.
 */
function extractPropertysRG(propertyString, propertyObject) {
    let keys = Object.keys(threatsRG);
    for (let i = 0; i < keys.length; i++) {
        if (propertyString.trim() == keys[i]) {
            propertyObject.diameter = threatsRG[keys[i]].diameter;
            propertyObject.pitch = threatsRG[keys[i]].pitch;
            break;
        }
    }
}


/**
 * Calculates the Laepp Bohr Durchmesser based on the given thread properties.
 * 
 * @param {Object} threadPropertys - The thread properties object.
 * @returns {number} - The calculated Laepp Bohr Durchmesser.
 */
function getLaeppBohrDurchmesser(threadPropertys) {
    let threadType = LAEPPBOHR_ARRAY.find(element => element.type == threadPropertys.type);
    if (threadType && threadType.func) return threadType.func(threadPropertys);
    return LDBOHR_INVALID;
}


/**
 * Calculates the Laepp Bohr Durchmesser Uni based on the given thread properties.
 * For Threadtype UN, BS, M, R, G, and W.
 * @param {Object} threadPropertys - The thread properties object.
 * @param {number} threadPropertys.diameter - The diameter of the thread.
 * @param {number} threadPropertys.pitch - The pitch of the thread.
 * @returns {number} - The calculated Laepp Bohr Durchmesser Uni.
 */
function getLaeppBohrDurchmesserUni(threadPropertys) {
    let bohrer = threadPropertys.diameter - (2 * threadPropertys.pitch);
    if (threadPropertys.diameter > 20) bohrer -= 5;
    else bohrer -= 3;
    let result = bohrer.toFixed(2);
    if (result < 1.6) result = 1.6;
    return result;
}
