let editGT_ID = -1;
let showLinesWeek = 0;


function renderListType(listType) {
    document.getElementById('list_type').innerHTML = listType;
}


function renderShowLines(lineCounter) {
    document.getElementById('num_filter').innerHTML = `${lineCounter} von ${tableCPU.length} Aufträgen`;
}


function renderTableHeadline(tableHeadKeys) {
    let headerContent = '';
    for (let index = 0; index < tableHeadKeys.length; index++) {
        headerContent += `<th>${tableHeaderStrings[tableHeadKeys[index]]}</th>`;
    }
    return `<tr>${headerContent}</tr>`;
}

const specialFieldRenderer = {
    "KENNWORT": renderKENNWORT,
    "NUMMER": renderNUMMER,
    "ABMESSUNG_PUR": renderABMESSUNG,
    "LDBOHRDURCHMESSER": renderLDBohr,
    "LDROHDURCHMESSER": renderLDRoh,
    "GEWINDETYPE": renderGewType,
}


function renderGewType(index, element) {
    let type = element.GEWINDETYPE ? element.GEWINDETYPE : '';
    let content = type;
    if (type == '???') {
        content = `<button onClick="openGewindeChangeDialog(${index})" style="background-color: orange;">${type}</button>`
    }
    return `<td>${content}</td>`;
}


function openGewindeChangeDialog(index) {
    editGT_ID = index;
    document.getElementById('gewinde_type').value = '';
    document.getElementById('gewinde_diameter').value = '';
    document.getElementById('gewinde_pitch').value = '';
    document.getElementById('changegewindetype').classList.remove('hide');
}


function changeGT_cancel() {
    editGT_ID = -1;
    document.getElementById('changegewindetype').classList.add('hide');
}


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


function renderLDRoh(index, element) {
    let innerHtml = element.LDROHDURCHMESSER;
    let action = '';
    if (element.LDROHDURCHMESSER == '?') innerHtml = getLDRohSelect(index);
    else action = `onClick="setLDRohUnknow(${index})"`;
    return `<td ${action} style="${getColorLDRohDiameter(element.LDROHDURCHMESSER)};${action == '' ? '' : 'cursor: pointer;'}">${innerHtml}</td>`;
}


function getColorLDRohDiameter(tag) {
    let color = 'orange';
    if (tag == 'Mittel') color = 'yellow';
    else if (tag == 'Groß') color = 'red';
    else if (tag == 'Klein') color = 'green';
    return `background-color: ${color};`;
}


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


function setLDRohUnknow(index) {
    const element = tableCPU[index];
    element.LDROHDURCHMESSER = '?';
    renderNew(lastRenderType);
}


function changeLDRohSelect(index) {
    const element = tableCPU[index];
    const newLDRoh = document.getElementById('select_roh_diameter_' + index).value;
    element.LDROHDURCHMESSER = newLDRoh;
    renderNew(lastRenderType);
}


function renderNUMMER(index, element) {
    let color = '';
    if (element['ZU_AUFTRAG']) {
        if (element.ZU_AUFTRAG == '00000000') color = 'background-color: rgb(255, 168, 168);';
        else color = 'background-color: rgb(92, 238, 92);';
    }
    if (element['HINWEISTEXT'] && element.HINWEISTEXT.includes('EXPRESS')) color = 'background-color: rgb(141, 141, 255);';
    return `<td style="${color}">${element.NUMMER}</td>`;
}


const tableKENNWORTconditions = [
    "",
    "S",
    "S L",
    "S L LD",
    "S L LD H",
    "S L LD H R",
]


function removeTagFromKENNWORT(tableElement, index) {
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


function addTagFromKENNWORT(tableElement, index) {
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


function renderABMESSUNG(index, element) {
    return `<td style="text-align: left;padding-left: 10px;">${element.ABMESSUNG_PUR ? element.ABMESSUNG_PUR : ''}</td>`;
}


function renderLDBohr(index, element) {
    return `<td style="text-align: left;padding-left: 5px;">${element.LDBOHRDURCHMESSER ? element.LDBOHRDURCHMESSER : ''}</td>`;
}


function renderKENNWORT(index, element) {
    let fieldKENNWORT = element.KENNWORT;
    let currentIndex = tableKENNWORTconditions.findIndex((e) => { return fieldKENNWORT == e; });
    let fieldHTML = fieldKENNWORT;
    if (currentIndex > 0) fieldHTML += `<button onClick="removeTagFromKENNWORT(this,${index})">&#x2770;</button>`;
    if (currentIndex < tableKENNWORTconditions.length - 1) fieldHTML += `<button onClick="addTagFromKENNWORT(this,${index})">&#x2771;</button>`;
    return `<td style="text-align: left;" id="kennwort_${index}">${fieldHTML}</td>`;
}


function renderDefault(fieldValue) {
    return `<td>${fieldValue}</td>`;
}


let renderGroupingState = 0;
let lastGroupingIndex = -1;
const renderGroupingColors = ['lightgray', 'white'];

function renderGrouping(index, field) {
    if (lastGroupingIndex >= 0 && (tableCPU[lastGroupingIndex][field] != tableCPU[index][field])) {
        renderGroupingState = +!renderGroupingState;
    }
    lastGroupingIndex = index;
    return `<td style="background-color:${renderGroupingColors[renderGroupingState]}">${tableCPU[index][field]}</td>`;
}


function renderTableLine(index, element, tableHeadKeys) {
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
    function isRohteilDM(element, diameter) { return element.ROHTEILDURCHMESSER ? element.ROHTEILDURCHMESSER == `&Oslash;${diameter}` : false; }
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
    const renderRows = ['0', '22', '32', '38', '45', '53', '63', '71',];
    const maxWeekShows = 6;
    let currentWeek = getWeekNumber(new Date(Date.now())) - 2;
    let tabelInnerHTML = '';
    showLinesWeek = 0;

    for (let index = 0; index < renderRows.length; index++) {
        const rohDM = renderRows[index];
        let headRow = '';
        let firstCell = '';
        if (rohDM == '0') firstCell = '<th></th>';
        else firstCell = `<td>&Oslash;${rohDM}</td>`;
        for (let week = currentWeek; week < currentWeek + maxWeekShows; week++) {
            if (rohDM == '0') {
                headRow += `<th>${week}</th>`;
            } else {
                headRow += renderWeekCellInfo(week, rohDM, renderRows[index - 1]);
            }
        }
        tabelInnerHTML += `<tr>${firstCell}${headRow}</tr>`;
    }
    document.getElementById('list_content').innerHTML = `<table><tbody class="table_week">${tabelInnerHTML}</tbody></table>`;
    return showLinesWeek;
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

