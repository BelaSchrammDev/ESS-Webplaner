/**
 * extend the orderJSON with usefull propertys for later using on multiple views
 */
function extendTable() {
    for (let index = 0; index < tableCPU.length; index++) {
        const element = tableCPU[index];
        extendABMESSUNG(element);
        extendSTATUS(element);
        extendKENNWORT(element);
        extendNENNDURCHMESSER_STEIGUNG(element);
        extendLAEPPDORN_RawMaterial(element);
        extendLaeppBohr(element);
        element['LAEPPDATE'] = getDateFromGER(element['T_LAEPP']);
        element['ROHTEILDATE'] = getDateFromGER(element['T_R']);
        element['BELEGDATE'] = new Date(element['BELEGDATUM']);
        extendROHTEIL_KW(element);
    }
}


/**
 * set the week of the ROHTEIL Date
 * 
 * @param {Object} element orderJSON to change
 */
function extendROHTEIL_KW(element) {
    element.ROHTEILWOCHE = getWeekNumber(element.ROHTEILDATE);
}


/**
 * get the week of a Date
 * 
 * @param {Date} sourceDate Date from which the calendar week is calculated
 * @returns {Number} number of the week
 */
function getWeekNumber(sourceDate) {
    let date = new Date(sourceDate);
    let dayNum = date.getUTCDay() - 3;
    if (dayNum < 0) dayNum += 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7) - 1;
};


/**
 * set the LDBOHRDURCHMESSER of the order
 * 
 * @param {Object} element orderJSON to change
 */
function extendLaeppBohr(element) {
    if (element['threadPropertys']) {
        let thProp = element.threadPropertys;
        if (thProp['diameter'] && thProp['pitch']) {
            let bohrer = thProp.diameter - (2 * thProp.pitch);
            if (thProp.diameter > 20) bohrer -= 5;
            else bohrer -= 3;
            element.LDBOHRDURCHMESSER = bohrer.toFixed(2);
            if (element.LDBOHRDURCHMESSER < 1.6) element.LDBOHRDURCHMESSER = 1.6;
        }
    }
}


/**
 * copy the KENNWORT to KENNWORT_CPU for later using
 * 
 * @param {Object} element orderJSON to change
 */
function extendKENNWORT(element) {
    element.KENNWORT_CPU = element['KENNWORT'];
}


/**
 * set the status of the order in which it is currently stored
 * 
 * @param {Object} element orderJSON to change
 */
function extendSTATUS(element) {
    const tableKennwort = {
        "S L LD H R": "Rohlinge",
        "S L LD H": "Härterei",
        "S L LD": "Läppdorne",
        "S L": "Läppen",
        "S": "Schleifen",
    };
    if (tableKennwort[element['KENNWORT']]) {
        element['STATUS'] = tableKennwort[element['KENNWORT']];
    } else {
        element['STATUS'] = '-?-';
    }
}


/**
 * set the ROHTEILDURCHMESSER and APMESSUNG_PUR property of the orderJSON
 * 
 * @param {Object} element orderJSON to change
 */
function extendABMESSUNG(element) {
    const realRohteilDiameters = ['22', '32', '38', '45', '53', '63', '71',];
    if (element['ABMESSUNG']) {
        const abmessung = element['ABMESSUNG'];
        if (abmessung[0] == '�') {
            const rohteilStrings = element['ABMESSUNG'].split(' ');
            if (rohteilStrings.length > 0 && realRohteilDiameters.includes(rohteilStrings[1])) {
                element.ROHTEILDURCHMESSER = '&Oslash;' + rohteilStrings[1];
                element.ABMESSUNG_PUR = abmessung.substring(abmessung.indexOf(' ', 3) + 1);
            } else {
                element.ROHTEILDURCHMESSER = '&Oslash;' + abmessung.substring(1, abmessung.indexOf(' '));
                if (element.ROHTEILDURCHMESSER.length == 8 || element.ROHTEILDURCHMESSER.length == 9) element.ROHTEILDURCHMESSER = '';
                element.ABMESSUNG_PUR = abmessung.substring(abmessung.indexOf(' ') + 1);
            }
        }
        else {
            element.ABMESSUNG_PUR = abmessung;
        }
    }
}


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
    }
}


function getSubstrHS(text) {
    let pos = text.search(/[\s-]/); if (pos == -1) return text; return text.substring(0, pos);
}


function getSubstrMinus(text) {
    let pos = text.search(/[-]/); if (pos == -1) return text; return text.substring(0, pos);
}


function getSubstrX(text) {
    let pos = text.search(/[x]/); if (pos == -1) return text; return text.substring(0, pos);
}


/**
 * analyzed and calculate the property of the thread
 * still to implement: Pg, Fg, BS
 * where BS count be calculated with the same function like UN
 * 
 * @param {string} abmessung string with thread description
 * @returns {{type: string, diameter: Number, pitch: Number}} JSON with propertys type, diameter and pitch
 */
function getThreadPropertys(abmessung) {
    const astr = abmessung.trim();
    const typeString = getThreadType(astr.substring(0, astr.indexOf(' ')));
    let propertyString = astr.substring(astr.indexOf(' ')).trim();
    if (/[0-9]/.test(typeString[0])) { return undefined; }
    if (typeString == 'UN') return getThreadPropertysUN(propertyString, typeString);
    if (typeString == 'R' || typeString == 'G') return getThreadPropertysRG(propertyString, typeString)
    if (typeString == 'M' || typeString == 'Tr') return getThreadPropertysM_TR(propertyString, typeString);
    return undefined;
}

/**
 * adjusted the threadtype, returns '' when thread type unknow
 * 
 * @param {string} typeString string with the begin of thread descrition
 * @returns {string} the adjusted threadtype characters
 */
function getThreadType(typeString) {
    const startStrings = ['UN', 'M', 'BS'];
    for (let index = 0; index < startStrings.length; index++) {
        const chars = startStrings[index];
        if (typeString.startsWith(chars)) return chars;
    }
    return typeString;
}


/**
 * get the threadproperty for JSON for Tr thread, if can be calculated or null
 * 
 * @param {string} propertyStr thread propertystring
 * @param {string} type thread type
 * @returns {{type: string, diameter: Number, pitch: Number}} JSON with propertys type, diameter and pitch
 */
function getThreadPropertysM_TR(propertyStr, type) {
    let diameter = 0;
    let pitch = 0;
    propertyStr = propertyStr.replaceAll(',', '.');
    propertyStr = propertyStr.replaceAll('SK', ' ');
    propertyStr = propertyStr.replaceAll('Sk', ' ');
    if (propertyStr.includes('x')) {
        diameter = getSubstrX(propertyStr);
        pitch = getSubstrHS(propertyStr.substring(propertyStr.indexOf('x') + 1));
    }
    else if (type == 'M') {
        let propertySubString = getSubstrHS(propertyStr);
        diameter = propertySubString;
        if (threatMregular_Pitch[propertySubString]) pitch = threatMregular_Pitch[propertySubString];
        else pitch = '-?-';
    }
    return { type, diameter, pitch }
}


/**
 * get the threadproperty for JSON for R or G thread,  if can be calculated or null
 * 
 * @param {string} propertyStr thread propertystring
 * @param {string} type thread type
 * @returns {{type: string, diameter: Number, pitch: Number}} JSON with propertys type, diameter and pitch
 */
function getThreadPropertysRG(propertyStr, type) {
    let diameter = 0;
    let propertySubString = getSubstrHS(propertyStr);
    if (threatsRG[propertySubString]) {
        diameter = threatsRG[propertySubString].diameter;
        pitch = threatsRG[propertySubString].pitch;
    }
    return { type, diameter, pitch }
}


/**
 * get the threadproperty for JSON for UN thread,  if can be calculated or null
 * 
 * @param {string} propertyStr thread propertystring
 * @param {string} type thread type
 * @returns {{type: string, diameter: Number, pitch: Number}} JSON with propertys type, diameter and pitch
 */
function getThreadPropertysUN(propertyStr, type) {
    let diameter = 0;
    let propertySubString = getSubstrMinus(propertyStr);
    if (propertySubString.includes('/')) {
        let factors = propertySubString.trim().split('/');
        if (factors.length > 1) {
            let firstFac = +factors[0];
            let secondFac = +factors[1];
            if (factors[0].includes(' ')) {
                let firstFactors = factors[0].split(' ');
                firstFac = +firstFactors[1];
                if (firstFactors[0] == '1') firstFac += secondFac;
                if (firstFactors[0] == '2') firstFac += secondFac * 2;
            }
            diameter = (25.4 / secondFac * firstFac).toFixed(2);
        }
    }
    else if (propertySubString == '1') diameter = 25.4;
    else if (propertySubString.startsWith('0.') || propertySubString.startsWith('1.')) {
        diameter = (25.4 * parseFloat(propertySubString)).toFixed(2);
    }
    else return undefined;

    let pitch = 0;
    propertySubString = getSubstrHS(propertyStr.substring(propertyStr.indexOf('-') + 1));
    pitch = (25.4 / propertySubString).toFixed(4);
    return { type, diameter, pitch }
}


/**
 * set the threadproperty of the elemnt
 * 
 * @param {Object} element orderJSON to change
 */
function extendNENNDURCHMESSER_STEIGUNG(element) {
    if (element.ABMESSUNG_PUR) {
        setGewindeTypePropertys(element, getThreadPropertys(element.ABMESSUNG_PUR));
    }
}


function setGewindeTypePropertys(element, propertys) {
    if (propertys) {
        element.threadPropertys = propertys;
        element.GEWINDETYPE = propertys.type;
        element.NENNDURCHMESSER = propertys.diameter ? +propertys.diameter : '??';
        element.STEIGUNG = propertys.pitch ? +propertys.pitch : '??';
    } else {
        element.GEWINDETYPE = '???';
        element.NENNDURCHMESSER = '??';
        element.STEIGUNG = '??';
    }
}


/**
 * set the LÄPPDORNROHMATERIAL property
 * 
 * @param {Object} element orderJSON to change
 */
function extendLAEPPDORN_RawMaterial(element) {
    if (element['threadPropertys'] && element.threadPropertys['diameter']) {
        element.LDROHDURCHMESSER = 'Klein';
        if (element.threadPropertys.diameter >= 24.8) element.LDROHDURCHMESSER = 'Mittel';
        if (element.threadPropertys.diameter >= 34.8) element.LDROHDURCHMESSER = 'Groß';
    }
    else element.LDROHDURCHMESSER = '?';
}


/**
 * parse a string to a Date Object and return this
 * or is this impossible then return 01/01/2022
 * 
 * @param {string} dateString string to parse to a valid datetime
 * @returns {Date} Date Object
 */
function getDateFromGER(dateString) {
    const dateStrings = dateString.split('.');
    if (dateStrings.length > 2) {
        if (dateStrings[2].length == 2) dateStrings[2] = '20' + dateStrings[2];
        return new Date(+dateStrings[2], +dateStrings[1] - 1, +dateStrings[0]);
    }
    return new Date('2022', '0', '1');
}
