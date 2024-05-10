let headKeys = [];
const requiredKeys = ['SUCHBEZEICHNUNG', 'NUMMER', 'BEZEICHNUNG1', 'BEZEICHNUNG2', 'INFO2', 'INFO1', 'BEDARF', 'LAGER_1',];
let prioTable = [];


async function loadExcel(inputfield) {
    readXlsxFile(inputfield.files[0]).then((rows) => {
        parseExcelArrayToJSON(rows);
    })
}


function parseExcelArrayToJSON(excelArray) {
    for (let index = 0; index < excelArray.length; index++) {
        console.log('Excel load...' + index + ' / ' + excelArray.length);
        const rowArray = excelArray[index];
        if (index == 0) {
            headKeys = rowArray;
        } else {
            let newRow = new Object();
            for (let excelIndex = 0; excelIndex < rowArray.length; excelIndex++) {
                const cell = rowArray[excelIndex];
                if (requiredKeys.includes(headKeys[excelIndex])) {
                    newRow[headKeys[excelIndex]] = rowArray[excelIndex];
                }
            }
            prioTable.push(newRow);
        }
    }
}