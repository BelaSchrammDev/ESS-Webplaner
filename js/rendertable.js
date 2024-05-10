/**
 * variables definition
 */
let editGT_ID = -1;
let showLinesWeek = 0;


/**
 * variables for the grouping feature
 */
let renderGroupingState = 0;
let lastGroupingIndex = -1;
const renderGroupingColors = ['lightgray', 'white'];


/**
 * render the listtype string 
 * 
 * @param {string} listType string to render in infofield
 */
function renderListType(listType) {
    document.getElementById('list_type').innerHTML = listType;
}


/**
 * show the count of rendered order
 * 
 * @param {Number} lineCounter number of rendered orders
 */
function renderShowLines(lineCounter) {
    document.getElementById('num_filter').innerHTML = `${lineCounter} von ${tableCPU.length} Aufträgen`;
}


/**
 * returns the HTML code for the headerrow of the table
 * 
 * @param {string[]} tableHeadKeys array of the headerdescription
 * @returns {string} tablerow HTML string
 */
function renderTableHeadline(tableHeadKeys) {
    let headerContent = '';
    for (let index = 0; index < tableHeadKeys.length; index++) {
        headerContent += `<th>${tableHeaderStrings[tableHeadKeys[index]]}</th>`;
    }
    return `<tr>${headerContent}</tr>`;
}


/**
 * specialfieldrenderer for the threadtype field ['GEWINDETYPE']
 * get the HTML code of the threadtype field,
 * if unknow then with a button to input the threadpropertys manually
 * 
 * @param {Number} index index of the orderJSON in the array
 * @param {Object} element orderJSON object
 * @returns {string} HTML code of the td element
 */
function renderGewType(index, element) {
    let type = element.GEWINDETYPE ? element.GEWINDETYPE : '';
    let content = type;
    if (type == '???') {
        content = `<button onClick="openThreadChangeDialog(${index})" style="background-color: orange;">${type}</button>`
    }
    return `<td>${content}</td>`;
}


/**
 * show the ThreadChangeOverlay
 * 
 * @param {Number} index index of the orderJSON in the array
 */
function openThreadChangeDialog(index) {
    editGT_ID = index;
    document.getElementById('gewinde_type').selectedIndex = 0;
    document.getElementById('gewinde_diameter').value = '';
    document.getElementById('gewinde_pitch').value = '';
    document.getElementById('changegewindetype').classList.remove('hide');
}


/**
 * function is executed when the cancel button is pressed
 */
function changeGT_cancel() {
    editGT_ID = -1;
    document.getElementById('changegewindetype').classList.add('hide');
}


/**
 * function is executed when the ok button is pressed
 */
function changeGT_confirm() {
    let gType = document.getElementById('gewinde_type').value;
    let gDiameter = document.getElementById('gewinde_diameter').value;
    let gPitch = document.getElementById('gewinde_pitch').value;
    if (gType && gDiameter && gPitch) {
        let newThreadProperty = new Object();
        newThreadProperty.type = gType;
        newThreadProperty.diameter = gDiameter;
        newThreadProperty.pitch = gPitch;
        let element = tableCPU[editGT_ID];
        setGewindeTypePropertys(element, newThreadProperty);
        extendLAEPPDORN_RawMaterial(element);
        extendLaeppBohr(element);
        if (lastRenderType) renderNew(lastRenderType);
        else renderFilterAndStoreTheFunction(filterAlle);
        editGT_ID = -1;
        document.getElementById('changegewindetype').classList.add('hide');
    }
    else {
        alert('Bitte alles ausfüllen');
    }
}


/**
 * specialfieldrenderer for the LDROHDURCHMESSER field with text-align settings
 * and onclick action to change the LDROHDURCHMESSER to unknow ['?']
 * or a dropdown list to select the right value.
 * possible values are 'Mittel', 'Groß' and 'Klein', or if unknow, '?'
 * 
 * @param {Number} index index of the orderJSON in the array
 * @param {Object} element orderJSON object
 * @returns {string} HTML code as td element for the table
 */
function renderLDRoh(index, element) {
    let innerHtml = element.LDROHDURCHMESSER;
    let action = '';
    if (element.LDROHDURCHMESSER == '?') innerHtml = getLDRohSelect(index);
    else action = `onClick="setLDRohUnknow(${index})"`;
    return `<td ${action} style="${getTextAlignmentLDRohDiameter(element.LDROHDURCHMESSER)};${action == '' ? '' : 'cursor: pointer;'}">${innerHtml}</td>`;
}


/**
 * get the text-align style string for the LDROHDURCHMESSER field
 * 
 * @param {string} tag LDROHDURCHMESSER type as string, can be 'Mittel', 'Groß' and 'Klein', or, if unknow '?'
 * @returns {string} style string for the text-align property
 */
function getTextAlignmentLDRohDiameter(tag) {
    let align = 'center';
    let bgColor = 'white';
    if (tag == 'Mittel') align = 'center';
    else if (tag == 'Groß') align = 'right';
    else if (tag == 'Klein') align = 'left';
    else bgColor = 'orange';
    return `text-align: ${align}; background-color: ${bgColor};`;
}


/**
 * get the HTML code for a dropdown list with possible values
 * 'Mittel', 'Groß' and 'Klein', or, if unknow '?'
 * 
 * @param {Number} index index of the orderJSON in the array
 * @returns {string} HTML code for the dropdown list
 */
function getLDRohSelect(index) {
    return `
    <label for="select_roh_diameter_${index}">Roh...</label>
        <select onchange="changeLDRohSelect(${index})" id="select_roh_diameter_${index}" name="select_roh_diameter_${index}">
            <option value="?">?</option>
            <option value="Klein">Klein</option>
            <option value="Mittel">Mittel</option>
            <option value="Groß">Groß</option>
        </select>
    `
}


/**
 * function is executed when the LDROHDURCHMESSER field in the table is pressed
 * the value is set to unknow
 * 
 * @param {Number} index index of the orderJSON in the array
 */
function setLDRohUnknow(index) {
    const element = tableCPU[index];
    element.LDROHDURCHMESSER = '?';
    renderNew(lastRenderType);
}


/**
 * function is executed when the LDROHDURCHMESSER dropdown list is changed
 * 
 * @param {Number} index index of the orderJSON in the array
 */
function changeLDRohSelect(index) {
    const element = tableCPU[index];
    const newLDRoh = document.getElementById('select_roh_diameter_' + index).value;
    element.LDROHDURCHMESSER = newLDRoh;
    renderNew(lastRenderType);
}


/**
 * specialfieldrenderer for the NUMMER field, this is the unique ordernumber
 * she gives the HTML code for a td element back
 * 
 * @param {Number} index index of the orderJSON in the array
 * @param {Object} element JSON order object 
 * @returns {string} HTML code as td element
 */
function renderNUMMER(index, element) {
    let color = '';
    if (element['ZU_AUFTRAG']) {
        if (element.ZU_AUFTRAG != '00000000') color = 'background-color: rgb(92, 238, 92);';
    }
    if (element['HINWEISTEXT'] && element.HINWEISTEXT.includes('EXPRESS')) color = 'background-color: rgb(141, 141, 255);';
    return `<td ${color == '' ? '' : ' style="' + color + ';"'}>${element.NUMMER}</td>`;
}

// <div style="background-color: rgb(red, green, blue);"></div>


/**
 * possible values of the field KENNWORT
 */
const tableKENNWORTconditions = [
    "",
    "S",
    "S L",
    "S L LD",
    "S L LD H",
    "S L LD H R",
]


/**
 * remove one KENNWORT segment from the string and set the new value to the element
 * 
 * @param {Number} index index of the orderJSON in the array
 */
function removeTagFromKENNWORT(index) {
    const element = tableCPU[index];
    const kennwort = element.KENNWORT;
    if (tableKENNWORTconditions.includes(kennwort)) {
        let currentIndex = tableKENNWORTconditions.findIndex((e) => { return kennwort == e; });
        if (currentIndex > 0) {
            currentIndex--;
            element.KENNWORT = tableKENNWORTconditions[currentIndex];
            document.getElementById('kennwort_' + index).innerHTML = renderKENNWORT(index, element);
        }
    }
}


/**
 * add one KENNWORT segment to the string and set the new value to the element
 * 
 * @param {Number} index index of the orderJSON in the array
 */
function addTagFromKENNWORT(index) {
    const element = tableCPU[index];
    const kennwort = element.KENNWORT;
    if (tableKENNWORTconditions.includes(kennwort)) {
        let currentIndex = tableKENNWORTconditions.findIndex((e) => { return kennwort == e; });
        if (currentIndex < tableKENNWORTconditions.length - 1) {
            currentIndex++;
            element.KENNWORT = tableKENNWORTconditions[currentIndex];
            document.getElementById('kennwort_' + index).innerHTML = renderKENNWORT(index, element);
        }
    }
}


/**
 * specialfieldrenderer for the field ABMESSUNG
 * 
 * @param {Number} index index of the orderJSON in the array,
 *                 is not actually needet, but the render function can only pass these parameters
 * @param {Object} element orderJSON object
 * @returns {string} HTML code as a td element
 */
function renderABMESSUNG(index, element) {
    return `<td style="text-align: left;padding-left: 10px;">${element.ABMESSUNG_PUR ? element.ABMESSUNG_PUR : ''}</td>`;
}


/**
 * specialfieldrenderer for the field LDBOHRDURCHMESSER
 * 
 * @param {Number} index index of the orderJSON in the array,
 *                 is not actually needet, but the render function can only pass these parameters
 * @param {Object} element orderJSON object
 * @returns {string} HTML code as a td element
 */
function renderLDBohr(index, element) {
    return `<td style="text-align: left;padding-left: 5px;">${element.LDBOHRDURCHMESSER ? element.LDBOHRDURCHMESSER : ''}</td>`;
}


/**
 * specialfieldrenderer for the field KENNWORT, with functionality for add and remove segments from the KENNWORT field
 * 
 * @param {Number} index index of the orderJSON in the array
 * @param {Object} element orderJSON object
 * @returns {string} HTML code as a td element
 */
function renderKENNWORT(index, element) {
    let fieldKENNWORT = element.KENNWORT;
    let currentIndex = tableKENNWORTconditions.findIndex((e) => { return fieldKENNWORT == e; });
    let fieldHTML = fieldKENNWORT;
    if (currentIndex != -1) {
        if (currentIndex > 0) fieldHTML += `<button onClick="removeTagFromKENNWORT(${index})">&#x2770;</button>`;
        if (currentIndex < tableKENNWORTconditions.length - 1) fieldHTML += `<button onClick="addTagFromKENNWORT(${index})">&#x2771;</button>`;
    }
    return `<td style="text-align: left;" id="kennwort_${index}">${fieldHTML}</td>`;
}


/**
 * defaultrenderer for a fieldvalue
 * 
 * @param {string} fieldValue string to render in the td element 
 * @returns {string} HTML code as td element for the table
 */
function renderDefault(fieldValue) {
    return `<td>${fieldValue}</td>`;
}


/**
 * get the HTML code of the td element with the corresponding grouping background-color
 * 
 * @param {Number} index index of the orderJSON in the array
 * @param {string} field field that will be grouping
 * @returns {string} HTML code with grouping color settings
 */
function renderGrouping(index, field) {
    if (lastGroupingIndex >= 0 && (tableCPU[lastGroupingIndex][field] != tableCPU[index][field])) {
        renderGroupingState = +!renderGroupingState;
    }
    lastGroupingIndex = index;
    return `<td style="background-color:${renderGroupingColors[renderGroupingState]}">${tableCPU[index][field]}</td>`;
}


/**
 * render a complete line of a order
 * 
 * @param {Number} index index of the orderJSON in the array
 * @param {Object} element order as JSON Object
 * @param {string[]} tableHeadKeys array of fields to be rendered
 * @returns {string} HTML code of the complete line to be rendered
 */
function renderTableLine(index, element, tableHeadKeys) {
    // list of special field renderfunctions, key is the field
    const specialFieldRenderer = {
        "KENNWORT": renderKENNWORT,
        "NUMMER": renderNUMMER,
        "ABMESSUNG_PUR": renderABMESSUNG,
        "LDBOHRDURCHMESSER": renderLDBohr,
        "LDROHDURCHMESSER": renderLDRoh,
        "GEWINDETYPE": renderGewType,
    }
    let rowContent = '';
    for (let x = 0; x < tableHeadKeys.length; x++) {
        const key = tableHeadKeys[x];
        const fieldValue = element[key] ? element[key] : '';
        if (specialFieldRenderer[key]) rowContent += specialFieldRenderer[key](index, element);
        else if (lastRenderType['grouping_key'] && lastRenderType['grouping_key'] == key) rowContent += renderGrouping(index, key);
        else rowContent += renderDefault(fieldValue);
    }
    return `<tr id="line_${index}">${rowContent}</tr>`
}


function renderWeekCellInfo(week, rohDM, minrohDM) {
    function isRohteilState(element) { return element.KENNWORT == 'S L LD H R'; }
    function isRohteilWeek(element, week) { return element.ROHTEILWOCHE == week; }
    function isRohteilDMRange(element, diameter, mindiameter) {
        const pureDiameter = element.ROHTEILDURCHMESSER ? +element.ROHTEILDURCHMESSER.substring(8) : 0;
        return pureDiameter <= diameter && pureDiameter > mindiameter;
    }
    let faLager = 0;
    let faKunde = 0;
    let cellColor = 'white';
    let cellTitle = '';
    for (let index = 0; index < tableCPU.length; index++) {
        const element = tableCPU[index];
        if (isRohteilState(element) && isRohteilWeek(element, week) && isRohteilDMRange(element, rohDM, minrohDM)) {
            if (element.ZU_AUFTRAG == '00000000' || element.ZU_AUFTRAG == '') {
                faLager++;
                showLinesWeek++;
            } else {
                faKunde++;
                showLinesWeek++;
                cellTitle += element.NUMMER + ' -> ' + element.ABMESSUNG_PUR + '\n';
            }
        }
    }
    if (faKunde > 0) cellColor = 'lightgreen';
    else if (faLager > 0) cellColor = 'lightpink';
    return `<td title="${cellTitle}">
            ${faKunde > 0 ? `<span style="color: green;">${faKunde}</span>` : ' '}
            ${faLager > 0 ? `<span style="color: red;">(${faLager})</span>` : ' '}
            </td>`;
}


function renderRohDMWeek() {
    const diameterArray = ['22', '32', '38', '45', '53', '63', '71'];
    let weekNumbers = getWeekNumberArray(6);
    let tabelInnerHTML = '<th></th>';
    weekNumbers.forEach((diameter) => tabelInnerHTML += `<th>${diameter}</th>`)
    showLinesWeek = 0;
    for (let index = 0; index < diameterArray.length; index++) {
        tabelInnerHTML += renderWeekRow(diameterArray[index], weekNumbers, diameterArray[index - 1]);
    }
    document.getElementById('list_content').innerHTML = `<table><tbody class="table_week">${tabelInnerHTML}</tbody></table>`;
    return showLinesWeek;
}


function renderWeekRow(rohDM, weekNumbers, diameter) {
    let rowHTML = `<td>&Oslash;${rohDM}</td>`;
    for (let index = 0; index < weekNumbers.length; index++) {
        rowHTML += renderWeekCellInfo(weekNumbers[index], rohDM, diameter);
    }
    return `<tr>${rowHTML}</tr>`;
}


function getWeekNumberArray(maxWeekShows) {
    let weekNumbers = [];
    let datetimeNow = new Date(Date.now());
    datetimeNow.setDate(datetimeNow.getDate() - 14); // startweek
    for (let index = 0; index < maxWeekShows; index++) {
        weekNumbers.push(getWeekNumber(datetimeNow));
        datetimeNow.setDate(datetimeNow.getDate() + 7);
    }
    return weekNumbers;
}


function renderTableDefault(renderOpt) {
    let showLines = 0;
    let inputDIV = document.getElementById('list_content')
    let tabelInnerHTML = renderTableHeadline(renderOpt['tablekeys']);
    for (let f = 0; f < renderOpt.filters.length; f++) {
        const filter = renderOpt.filters[f];
        for (let i = 0; i < tableCPU.length; i++) {
            const element = tableCPU[i];
            if (!filter.function || filter.function(element, filter.field, filter.value)) {
                showLines++;
                tabelInnerHTML += renderTableLine(i, element, renderOpt['tablekeys']);
            }
        }
    }
    inputDIV.innerHTML = `<table><tbody class="table_main">${tabelInnerHTML}</tbody></table>`;
    return showLines;
}


function renderNew(renderOpt) {
    lastRenderType = renderOpt;
    lastGroupingIndex = -1;
    renderGroupingState = 0;
    tableCPU.sort(sorters[renderOpt.sort]);
    renderListType(renderOpt['info']);
    let showLines = 0;
    if (renderOpt['renderFunction']) showLines = renderOpt.renderFunction(renderOpt);
    else showLines = renderTableDefault(renderOpt);
    renderShowLines(showLines);
}


function renderButtons() {
    let buttonBar = document.getElementById('button_bar_left');
    let renderKeys = Object.keys(renderTypes);
    let buttonGroupKeys = Object.keys(button_groups);
    for (let x = 0; x < buttonGroupKeys.length; x++) {
        const group = buttonGroupKeys[x];
        buttonBar.innerHTML += `<span>${button_groups[group]}</span>`;
        for (let i = 0; i < renderKeys.length; i++) {
            const renderType = renderTypes[renderKeys[i]];
            if (renderType.group == group) {
                buttonBar.innerHTML += `
                <button onclick="renderNew(renderTypes['${renderKeys[i]}'])">${renderType.buttonText}</button>
                `;
            }
        }
    }
}

