
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



class ThreadPropertys {
    type = '???';
    diameter = '??';
    pitch = '??';

    constructor(type, propertys = '') {
        this.type = type;
        this.propertys = propertys;
        if (propertys != '') this.extractPropertys();
    }
    replaceCharArray(str, charArray) {
        for (let i = 0; i < charArray.length; i++) {
            str = str.replaceAll(charArray[i].from, charArray[i].to);
        }
        return str;
    }
}

class ThreadUnkown extends ThreadPropertys {
    constructor() {
        super('???');
    }
}

class ThreadNPSM extends ThreadPropertys {
    constructor(type, propertys) {
        super('NPSM');
    }
}

class ThreadW extends ThreadPropertys {
    constructor(propertys) {
        super('W');
    }
}

class ThreadPg extends ThreadPropertys {
    constructor(propertys) {
        super('Pg');
    }
}

class ThreadTrM extends ThreadPropertys {
    constructor(type, propertys) {
        super(type, propertys);
    }
    extractPropertys() {
        this.propertys = this.replaceCharArray(this.propertys, [
            { from: ',', to: '.' },
            { from: 'SK', to: '' },
            { from: 'Sk', to: '' },
        ]);
        if (this.propertys.includes('x')) {
            this.diameter = getSubstrX(this.propertys);
            this.pitch = getSubstrHS(this.propertys.substring(this.propertys.indexOf('x') + 1));
        }
        else if (this.type == 'M') {
            let propertySubString = getSubstrHS(this.propertys);
            this.diameter = propertySubString;
            if (threatMregular_Pitch[propertySubString]) this.pitch = threatMregular_Pitch[propertySubString];
            else this.pitch = '-?-';
        }
    }
}


class ThreadUN extends ThreadPropertys {
    constructor(propertys, type = 'UN') {
        super(type, propertys);
    }
    extractPropertys() {
        let propertySubString = getSubstrMinus(this.propertys);
        if (propertySubString.includes('/')) {
            let factors = propertySubString.trim().split('/');
            if (factors.length > 1) {
                let bigFactor = 0;
                if (factors[0].includes(' ')) {
                    bigFactor = +factors[0].split(' ')[0] * 25.4;
                    factors[0] = factors[0].split(' ')[1];
                }
                this.diameter = (bigFactor + ((25.4 / factors[1]) * factors[0])).toFixed(2);
            }
        }
        else if (propertySubString == '8') this.diameter = 4.1;
        else if (propertySubString == '10') this.diameter = 4.8;
        else if (propertySubString == '1') this.diameter = 25.4;
        else if (propertySubString.startsWith('0.') || propertySubString.startsWith('1.')) {
            this.diameter = (25.4 * parseFloat(propertySubString)).toFixed(2);
        }
        if (this.diameter != '??') {
            propertySubString = getSubstrHS(this.propertys.substring(this.propertys.indexOf('-') + 1));
            this.pitch = (25.4 / propertySubString).toFixed(4);
        }
    }
}

class ThreadBS extends ThreadUN {
    constructor(propertys) {
        super(propertys, 'BS');
    }
}

class ThreadRG extends ThreadPropertys {
    constructor(type, propertys) {
        super(type, propertys);
    }
    extractPropertys() {
        let keys = Object.keys(threatsRG);
        for (let i = 0; i < keys.length; i++) {
            if (this.propertys.includes(keys[i])) {
                this.diameter = threatsRG[keys[i]].diameter;
                this.pitch = threatsRG[keys[i]].pitch;
                break;
            }
        }
    }
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
