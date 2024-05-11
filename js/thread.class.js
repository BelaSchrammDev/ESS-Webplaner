class ThreadPropertys {
    type = '???';
    diameter = '??';
    pitch = '??';

    constructor(type, propertys) {
        this.type = type;
        this.propertys = propertys;
    }
    replaceCharArray(str, charArray) {
        for (let i = 0; i < charArray.length; i++) {
            str = str.replaceAll(charArray[i].from, charArray[i].to);
        }
        return str;
    }
}

class ThreadUnkown extends ThreadPropertys {
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
    constructor(type, propertys) {
        super(type, propertys);
    }
    extractPropertys() {
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
                this.diameter = (25.4 / secondFac * firstFac).toFixed(2);
            }
        }
        else if (propertySubString == '8') this.diameter = 4.1;
        else if (propertySubString == '10') this.diameter = 4.8;
        else if (propertySubString == '1') this.diameter = 25.4;
        else if (propertySubString.startsWith('0.') || propertySubString.startsWith('1.')) {
            this.diameter = (25.4 * parseFloat(propertySubString)).toFixed(2);
        }
        if (this.diameter != '??') {
            propertySubString = getSubstrHS(propertyStr.substring(propertyStr.indexOf('-') + 1));
            this.pitch = (25.4 / propertySubString).toFixed(4);
        }
        else {
            this.type = '???';
        }
    }
}

class ThreadRG extends ThreadPropertys {
    constructor(type, propertys) {
        super(type, propertys);
    }
    extractPropertys() {
        for (key in threatsRG) {
            if (propertyStr.includes(key)) {
                this.diameter = threatsRG[key].diameter;
                this.pitch = threatsRG[key].pitch;
            }
        }
    }
}