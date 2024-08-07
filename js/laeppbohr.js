const LDBOHR_INVALID = '---';


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
