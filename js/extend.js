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
    if (ifThreadPropertyValid(element['threadPropertys'])) {
        element.LDBOHRDURCHMESSER = getLaeppBohrDurchmesser(element['threadPropertys']);
    } else element.LDBOHRDURCHMESSER = LDBOHR_INVALID;
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


/**
 * set the threadproperty of the elemnt
 * 
 * @param {Object} element orderJSON to change
 */
function extendNENNDURCHMESSER_STEIGUNG(element) {
    if (element.ABMESSUNG_PUR) {
        let threadPropertyObject = extractThreadPropertys(element.ABMESSUNG_PUR);
        element.threadPropertys = threadPropertyObject;
        element.GEWINDETYPE = threadPropertyObject.type;
        element.NENNDURCHMESSER = threadPropertyObject.diameter;
        if (threadPropertyObject.diameterFull) {
            element.NENNDURCHMESSERZOLL = (threadPropertyObject.diameterFull / 25.4).toFixed(4);
        } else
            element.NENNDURCHMESSERZOLL = '';
        element.STEIGUNG = threadPropertyObject.pitch;
    }
}


/**
 * set the LÄPPDORNROHMATERIAL property
 * 
 * @param {Object} element orderJSON to change
 */
function extendLAEPPDORN_RawMaterial(element) {
    if (ifThreadPropertyValid(element.threadPropertys)) {
        element.LDROHDURCHMESSER = 'Klein';
        if (element.threadPropertys.diameter >= 24.8) element.LDROHDURCHMESSER = 'Mittel';
        if (element.threadPropertys.diameter >= 34.8) element.LDROHDURCHMESSER = 'Groß';
    }
    else element.LDROHDURCHMESSER = '?';
}


/**
 * Checks if the thread properties are valid.
 *
 * @param {Object} threadPropertys - The thread properties to validate.
 * @returns {boolean} - Returns true if the thread properties are valid, otherwise false.
 */
function ifThreadPropertyValid(threadPropertys) {
    return (
        threadPropertys &&
        (threadPropertys.diameter != '??' && threadPropertys.diameter != '' && threadPropertys.diameter != '0') &&
        (threadPropertys.pitch != '??' && threadPropertys.pitch != '' && threadPropertys.pitch != '0')
    );
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
