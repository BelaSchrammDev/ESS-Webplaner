let headKeys = [];
const requiredKeys = ['SUCHBEZEICHNUNG', 'NUMMER', 'BEZEICHNUNG1', 'BEZEICHNUNG2', 'INFO2', 'INFO1', 'BEDARF', 'LAGER_1',];
let prioTable = [];


async function loadExcel(inputfield) {
    readXlsxFile(inputfield.files[0]).then((rows) => {
        parseExcelArrayToJSON(rows);
    })
}


function parseExcelArrayToJSON(excelArray) {
    prioTable = [];
    gtype = [];
    for (let index = 0; index < excelArray.length; index++) {
        console.log('Excel load...' + index + ' / ' + excelArray.length);
        const rowArray = excelArray[index];
        if (index == 0) {
            headKeys = rowArray;
        } else {
            let newRow = excelLineToJson(rowArray);
            extendThreadPropertys(newRow);
            extendLDDiameter(newRow);
            prioTable.push(newRow);
            if (newRow['GEWINDETYPE'] && newRow['GEWINDETYPE'] != '???' && !gtype.includes(newRow['GEWINDETYPE'])) {
                gtype.push(newRow['GEWINDETYPE']);
            }
        }
    }
    console.log(gtype);
}



function excelLineToJson(lineArray) {
    let newRow = new Object();
    for (let excelIndex = 0; excelIndex < lineArray.length; excelIndex++) {
        const cell = lineArray[excelIndex];
        if (requiredKeys.includes(headKeys[excelIndex])) {
            newRow[headKeys[excelIndex]] = lineArray[excelIndex];
        }
    }
    extendThreadPropertys(newRow);
    return newRow;
}


function extendLDDiameter(element) {
    if (element['INFO2'] && element['INFO2'].includes('LD Ø')) {
        let diameterString = element['INFO2'].split('LD Ø')[1];
        let diameter = parseFloat(diameterString);
        element['LDBOHRDURCHMESSER'] = diameter;
    }
}


function extendThreadPropertys(element) {
    if (element['SUCHBEZEICHNUNG']) {
        let threadPropertyObject = extractThreadPropertys(element['SUCHBEZEICHNUNG']);
        element['GEWINDETYPE'] = threadPropertyObject.type;
        element['NENNDURCHMESSER'] = threadPropertyObject.diameter;
        element['STEIGUNG'] = threadPropertyObject.pitch;
    }
}