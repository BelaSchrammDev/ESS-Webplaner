const tableHeaderStrings = {
    "ZU_AUFTRAG": "Kd.Auftrag",
    "T_R": "Termin<br>Rohlinge",
    "ABMESSUNG": "Abmessung von CPU",
    "ABMESSUNG_PUR": "Abmessung",
    "T_LAEPP": "Termin<br>Läppdorne",
    "KUNDE": "Kundennummer",
    "HINWEISTEXT": "Hinweis",
    "SUCHNAME": "Kennzahlen",
    "NETTOSUMME": "Nettosumme",
    "BELEGDATUM": "Belegdatum",
    "NUMMER": "ESS<br>Auftrags<br>Nummer",
    "KENNWORT": "Kennwort",
    "ROHTEILDURCHMESSER": "Rohteil<br>&Oslash;",
    "LDROHDURCHMESSER": "Läppdorn<br>Roh<br>Material",
    "LDBOHRDURCHMESSER": "Läppdorn<br>Bohrung<br>&Oslash;",
    "STATUS": "steht bei...",
    "LAEPPDATE": "Läppdatum",
    "ROHTEILDATE": "Rohlingsdatum",
    "ROHTEILWOCHE": "Wochen<br>termin<br>Rohling",
    "BELEGDATE": "Belegdatum",
    "KENNWORT_CPU": "Kennwort CPU",
    "NENNDURCHMESSER": "Gewinde<br>nenn<br>&Oslash;",
    "STEIGUNG": "Steigung",
    "GEWINDETYPE": "Type",
};

let dateCPUTable = new Date();
let tableCPU = [];
let tableCPU_Fields = [];


/**
 * load the json file
 * 
 * @param {HTMLElement} inputField Inputfield:File from onclick function
 */
function loadTable(inputField) {
    const jsonTableObject = inputField.files[0];
    dateCPUTable = new Date(jsonTableObject.lastModified);
    document.getElementById('lastModifiedDate').innerHTML = `${dateCPUTable.toLocaleString()}`;
    const reader = new FileReader();
    reader.onload = (evt) => {
        parseTable(evt.target.result);
    }
    reader.readAsText(jsonTableObject);
}


/**
 * parsing the table
 * 
 * @param {string} tableJSON - string with the json object
 */
function parseTable(tableJSON) {
    document.getElementById('filters').classList.remove('hide');
    document.getElementById('filters').classList.add('filters');
    document.getElementById('file_choise').classList.add('hide');
    tableCPU = JSON.parse(tableJSON);
    if (tableCPU.length > 0) {
        getOriginalCPU_Fields(tableCPU[0]);
        extendTable();
        renderNew(renderTypes.all);
    }
}


/**
 * save the original fields for later use
 * 
 * @param {Object} element - orderJSON befor extended
 */
function getOriginalCPU_Fields(element) {
    tableCPU_Fields = Object.keys(element);
}


