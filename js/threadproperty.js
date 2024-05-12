const TYPE_ARRAY = [
    { type: 'NPSM', matches: ['NPSM'], extractPropertyFunction: extractPropertysUnknow },
    { type: 'VG', matches: ['VG'], extractPropertyFunction: extractPropertysUnknow },
    { type: 'BS', matches: ['BSF', 'BSW', 'BSC'], extractPropertyFunction: extractPropertysUN },
    { type: 'UN', matches: ['NGO', 'UNJEF', 'UNJC', 'UNEF', 'UNJF', 'UNJ', 'UNF', 'UNS', 'UNR', 'UNC', 'UN'], extractPropertyFunction: extractPropertysUN },
    { type: 'Tr', matches: ['Tr', 'TR'], extractPropertyFunction: extractPropertysTrM },
    { type: 'M', matches: ['MJ', 'M'], extractPropertyFunction: extractPropertysTrM },
    { type: 'R', matches: ['R'], extractPropertyFunction: extractPropertysRG },
    { type: 'G', matches: ['G'], extractPropertyFunction: extractPropertysRG },
    { type: 'W', matches: ['W'], extractPropertyFunction: extractPropertysW },
    { type: 'Pg', matches: ['Pg'], extractPropertyFunction: extractPropertysUnknow },
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

function getSubstrHS(text) {
    let input = text.trim();
    let pos = input.search(/[\s-]/);
    if (pos == -1) return input;
    return input.substring(0, pos);
}


function getSubstrMinus(text) {
    let input = text.trim();
    let pos = input.search(/[-]/);
    if (pos == -1) return input;
    return input.substring(0, pos);
}


function getSubstrX(text) {
    let input = text.trim();
    let pos = input.search(/[x]/);
    if (pos == -1) return input;
    return input.substring(0, pos);
}


function replaceCharArray(str, charArray) {
    for (let i = 0; i < charArray.length; i++) {
        str = str.replaceAll(charArray[i].from, charArray[i].to);
    }
    return str;
}

function extractPropertysUnknow(propertyString, propertyObject) {
    // do nothing here, thread is unknown
}


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
            propertyObject.diameter = (bigFactor + ((25.4 / factors[1]) * factors[0])).toFixed(2);
        }
    }
    else if (+propertySubString > 20) {
        propertyObject.diameter = (parseFloat(propertySubString)).toFixed(2);
    }
    else if (propertySubString.includes('.')) {
        let result = (25.4 * parseFloat(propertySubString)).toFixed(2);
        propertyObject.diameter = result > 40 ? result / 25.4 : result;
    }
    else if (propertySubString == '8') propertyObject.diameter = 4.1;
    else if (propertySubString == '10') propertyObject.diameter = 4.8;
    else if (propertySubString == '1') propertyObject.diameter = 25.4;
    if (propertyObject.diameter != '??') {
        propertySubString = +getSubstrHS(propertyString.substring(propertyString.indexOf('-') + 1));
        if (propertySubString > 5) propertyObject.pitch = (25.4 / propertySubString).toFixed(4);
        else propertyObject.pitch = (propertySubString).toFixed(4);
    }
}


function extractPropertysRG(propertyString, propertyObject) {
    let keys = Object.keys(threatsRG);
    for (let i = 0; i < keys.length; i++) {
        if (propertyString.includes(keys[i])) {
            propertyObject.diameter = threatsRG[keys[i]].diameter;
            propertyObject.pitch = threatsRG[keys[i]].pitch;
            break;
        }
    }
}
