let lastRenderType = undefined;


const tableViewAllKeys = ['NUMMER', 'ROHTEILDURCHMESSER', 'ABMESSUNG_PUR', 'GEWINDETYPE', 'NENNDURCHMESSER', 'STEIGUNG', 'T_R', 'T_LAEPP', 'STATUS', 'KENNWORT',];
const tableViewRohteilKeys = ['NUMMER', 'ROHTEILDURCHMESSER', 'ABMESSUNG_PUR', 'T_R', 'ROHTEILWOCHE', 'KENNWORT',];
const tableViewLaeppdornKeys = ['NUMMER', 'ROHTEILDURCHMESSER', 'LDROHDURCHMESSER', 'LDBOHRDURCHMESSER', 'GEWINDETYPE', 'ABMESSUNG_PUR', 'NENNDURCHMESSER', 'STEIGUNG', 'T_LAEPP', 'KENNWORT'];
const tableViewLaeppKeys = ['NUMMER', 'ROHTEILDURCHMESSER', 'ABMESSUNG_PUR', 'GEWINDETYPE', 'NENNDURCHMESSER', 'STEIGUNG', 'T_R', 'T_LAEPP', 'KENNWORT'];


const sorters = {
    fa_number: function (a, b) {
        return a.NUMMER - b.NUMMER;
    },
    diameter_rohteil: function (a, b) {
        let aRDM = a['ROHTEILDURCHMESSER'] ? a.ROHTEILDURCHMESSER : '';
        let bRDM = b['ROHTEILDURCHMESSER'] ? b.ROHTEILDURCHMESSER : '';
        return aRDM.localeCompare(bRDM);
    },
    nenndurchmesser: function (a, b) {
        function getNDM(ndmString) { if (ndmString != undefined && ndmString != '??') return +ndmString; return 0; }
        if (a.NENNDURCHMESSER == 5 || b.NENNDURCHMESSER == 5) {
            console.log('debug');
        }
        let aNDM = getNDM(a.NENNDURCHMESSER);
        let bNDM = getNDM(b.NENNDURCHMESSER);
        if (aNDM > bNDM) return 1;
        else if (aNDM < bNDM) return -1;
        return 0;
    },
    date_laepp: function (a, b) {
        return new Date(a.LAEPPDATE).getTime() - new Date(b.LAEPPDATE).getTime();
    },
    date_rohling: function (a, b) {
        return new Date(a.ROHTEILDATE).getTime() - new Date(b.ROHTEILDATE).getTime();
    },
    date_beleg: function (a, b) {
        return new Date(a.BELEGDATE).getTime() - new Date(b.BELEGDATE).getTime();
    },
};


const button_groups = {
    kennwort: 'Filtern nach Kennwort',
    gewindeart: 'Filtern nach Gewindeart',
};


const renderTypes = {
    'all': {
        'group': 'kennwort',
        'sort': 'date_beleg',
        'info': 'Alle Aufträge',
        'buttonText': 'Alle Aufträge',
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: undefined,
                'field': '',
                'value': ''
            }
        ]
    },
    'roh': {
        'group': 'kennwort',
        // sort
        'sort': 'date_rohling',
        // info setzen
        'info': 'Alle Rohlingsaufträge',
        'buttonText': 'Rohlinge',
        // tabelle rendern
        'tablekeys': tableViewRohteilKeys,
        'grouping_key': 'ROHTEILWOCHE',
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S L LD H R'
            }
        ]
    },
    'rohrm': {
        'group': 'kennwort',
        // sort
        'sort': 'diameter_rohteil',
        // info setzen
        'info': 'Alle Rohlingsaufträge nach Rohlingsdurchmesser',
        'buttonText': 'Rohlinge RD',
        // tabelle rendern
        'tablekeys': tableViewRohteilKeys,
        'grouping_key': 'ROHTEILDURCHMESSER',
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S L LD H R'
            }
        ]
    },
    'rohweek': {
        'group': 'kennwort',
        // sort
        'sort': 'diameter_rohteil',
        // info setzen
        'info': 'Alle Rohlingsaufträge nach Roh&Oslash; und Woche',
        'buttonText': 'Rohlinge RD&W',
        // tabelle rendern
        'tablekeys': tableViewRohteilKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S L LD H R'
            }
        ],
        'renderFunction': renderRohDMWeek,
    },
    'hart': {
        'group': 'kennwort',
        // sort
        'sort': 'date_rohling',
        // info setzen
        'info': 'Alle Aufträge in der Härterei',
        'buttonText': 'Härterei',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S L LD H'
            }
        ]
    },
    'laeppd': {
        'group': 'kennwort',
        // sort
        'sort': 'date_laepp',
        // info setzen
        'info': 'Alle Aufträge zum Läppdorndrehen',
        'buttonText': 'Läppdorne',
        // tabelle rendern
        'tablekeys': tableViewLaeppdornKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S L LD'
            }
        ]
    },
    'laeppdrm': {
        'group': 'kennwort',
        // sort
        'sort': 'date_laepp',
        // info setzen
        'info': 'Alle Aufträge zum Läppdorndrehen nach Rohteildurchmesser',
        'buttonText': 'Läppdorne RM',
        // tabelle rendern
        'tablekeys': tableViewLaeppdornKeys,
        'filters': [
            {
                function: isFieldsEqualArray,
                'field': ['KENNWORT', 'LDROHDURCHMESSER'],
                'value': ['S L LD', 'Klein']
            },
            {
                function: isFieldsEqualArray,
                'field': ['KENNWORT', 'LDROHDURCHMESSER'],
                'value': ['S L LD', 'Mittel']
            },
            {
                function: isFieldsEqualArray,
                'field': ['KENNWORT', 'LDROHDURCHMESSER'],
                'value': ['S L LD', 'Groß']
            },
            {
                function: isFieldsEqualArray,
                'field': ['KENNWORT', 'LDROHDURCHMESSER'],
                'value': ['S L LD', '?']
            },
        ]
    },
    'laepp': {
        'group': 'kennwort',
        // sort
        'sort': 'date_laepp',
        // info setzen
        'info': 'Alle Aufträge zum Läppen',
        'buttonText': 'Läppen',
        // tabelle rendern
        'tablekeys': tableViewLaeppKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S L'
            }
        ]
    },
    'laeppka': {
        'group': 'kennwort',
        // sort
        'sort': 'date_laepp',
        // info setzen
        'info': 'Alle Kundenaufträge zum Läppen',
        'buttonText': 'Läppen KA',
        // tabelle rendern
        'tablekeys': tableViewLaeppKeys,
        'filters': [
            {
                function: isFieldEqualKA,
                'field': 'KENNWORT',
                'value': 'S L'
            }
        ]
    },
    'schleif': {
        'group': 'kennwort',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge beim Schleifen',
        'buttonText': 'Schleifen',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'KENNWORT',
                'value': 'S'
            }
        ]
    },
    'type_m': {
        'group': 'gewindeart',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge mit Metrischen Gewinde',
        'buttonText': 'Metrisch',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'GEWINDETYPE',
                'value': 'M'
            }
        ]
    },
    'type_m_ndm': {
        'group': 'gewindeart',
        // sort
        'sort': 'nenndurchmesser',
        // info setzen
        'info': 'Alle Aufträge mit Metrischen Gewinde nach Nenn &Oslash;',
        'buttonText': 'Metrisch nach &Oslash;',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'grouping_key': 'NENNDURCHMESSER',
        'filters': [
            {
                function: isFieldEqual,
                'field': 'GEWINDETYPE',
                'value': 'M'
            }
        ]
    },
    'type_un': {
        'group': 'gewindeart',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge mit Un Gewinde',
        'buttonText': 'UN...',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'GEWINDETYPE',
                'value': 'UN'
            }
        ]
    },
    'type_tr': {
        'group': 'gewindeart',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge mit Trapez Gewinde',
        'buttonText': 'Trapez',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'GEWINDETYPE',
                'value': 'Tr'
            }
        ]
    },
    'type_g': {
        'group': 'gewindeart',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge mit G Gewinde',
        'buttonText': 'G',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'GEWINDETYPE',
                'value': 'G'
            }
        ]
    },
    'type_r': {
        'group': 'gewindeart',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge mit R Gewinde',
        'buttonText': 'R',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldEqual,
                'field': 'GEWINDETYPE',
                'value': 'R'
            }
        ]
    },
    'type_other': {
        'group': 'gewindeart',
        // sort
        'sort': 'date_beleg',
        // info setzen
        'info': 'Alle Aufträge mit anderen Gewinde',
        'buttonText': 'Andere',
        // tabelle rendern
        'tablekeys': tableViewAllKeys,
        'filters': [
            {
                function: isFieldNotEqualArray,
                'field': 'GEWINDETYPE',
                'value': ['UN', 'Tr', 'M', 'G', 'R',]
            }
        ]
    },
}


function isFieldsEqualArray(element, fields, values) {
    let equal = [];
    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const value = values[index];
        equal.push(element[field] == value);
    }
    return equal.includes(false) ? false : true;
}

function isFieldEqualKA(element, field, value) {
    if (element.ZU_AUFTRAG == '00000000') return false;
    return element[field] ? element[field] == value : false;
}


function isFieldEqual(element, field, value) {
    return element[field] ? element[field] == value : false;
}


function isFieldNotEqualArray(element, field, noTypes) {
    return !noTypes.includes(element[field]);
}

