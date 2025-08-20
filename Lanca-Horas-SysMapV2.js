var ano = 2025;
var mes = 1;
var dia = 1;
var lancarAteDia = 25;

var dynamicsLast = document.querySelectorAll('[class="td-date"]');
if (dynamicsLast && dynamicsLast.length > 0) {
    var lastDynamicLast = dynamicsLast[dynamicsLast.length - 1];

    if (lastDynamicLast.querySelector('input') && lastDynamicLast.querySelector('input').value) {
        var ano = lastDynamicLast.querySelector('input').value.split('/')[2];
        var mes = Number(lastDynamicLast.querySelector('input').value.split('/')[1]);
        var dia = Number(lastDynamicLast.querySelector('input').value.split('/')[0]);
    }
}

if (document.querySelectorAll('.dynamicClockInOut').length === 0) {
    document.querySelector('[data-original-title="Adicionar um novo registro."]').click();
}

while (true) {
    dia = dia + 1;
    if (dia > lancarAteDia) {
        break;
    }

    var dayOfWeek = new Date(ano, mes - 1, dia).getDay();
    var isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0); // 6 = Saturday, 0 = Sunday

    if (isWeekend) {
        continue;
    }

    var lastManhaDynamicClockInOut = document.querySelectorAll('.dynamicClockInOut')[document.querySelectorAll('.dynamicClockInOut').length - 2];
    var lastTardeDynamicClockInOut = document.querySelectorAll('.dynamicClockInOut')[document.querySelectorAll('.dynamicClockInOut').length - 1];

    var lastEntradaManha = ['08', '00'];
    var lastSaidaManha = ['12', '01'];
    var lastEntradaTarde = ['13', '02'];
    var lastSaidaTarde = ['17', '01'];
    if (lastManhaDynamicClockInOut && lastManhaDynamicClockInOut.querySelector('[placeholder="Entrada"]')) {
        var lastEntradaManha = lastManhaDynamicClockInOut.querySelector('[placeholder="Entrada"]').value.split(':');
        var lastSaidaManha = lastManhaDynamicClockInOut.querySelector('[placeholder="Saida"]').value.split(':');
        var lastEntradaTarde = lastTardeDynamicClockInOut.querySelector('[placeholder="Entrada"]').value.split(':');
        var lastSaidaTarde = lastTardeDynamicClockInOut.querySelector('[placeholder="Saida"]').value.split(':');
    } else if (lastManhaDynamicClockInOut && lastManhaDynamicClockInOut.querySelector('.td-clockout')) {
        var lastEntradaManha = lastManhaDynamicClockInOut.querySelector('.td-clockin').innerText.split(':');
        var lastSaidaManha = lastManhaDynamicClockInOut.querySelector('.td-clockout').innerText.split(':');
        var lastEntradaTarde = lastTardeDynamicClockInOut.querySelector('.td-clockin').innerText.split(':');
        var lastSaidaTarde = lastTardeDynamicClockInOut.querySelector('.td-clockout').innerText.split(':');
    }

    var entradaManha = lastEntradaManha[0] + ':' + ("0" + (Number(lastEntradaManha[1]) + 1)).slice(-2);
    var saidaManha = lastSaidaManha[0] + ':' + ("0" + (Number(lastSaidaManha[1]) + 1)).slice(-2);
    var entradaTarde = lastEntradaTarde[0] + ':' + ("0" + (Number(lastEntradaTarde[1]) + 1)).slice(-2);
    var saidaTarde = lastSaidaTarde[0] + ':' + ("0" + (Number(lastSaidaTarde[1]) + 1)).slice(-2);

    if (lastManhaDynamicClockInOut) {
        document.querySelector('[data-original-title="Adicionar um novo registro."]').click();
    }

    var dynamics = document.querySelectorAll('[class="td-date"]');
    var lastDynamic = dynamics[dynamics.length - 1];

    console.log(("0" + dia).slice(-2) + '/' + mes + '/' + ano);
    lastDynamic.querySelector('input').value = ("0" + dia).slice(-2) + '/' + ("0" + mes).slice(-2) + '/' + ano;

    lastDynamic.querySelector('.button-add-clockinout-row').click()

    var timesheetRecordingHours = document.querySelectorAll('.textbox-timesheet-recording-hours');
    var timesheetRecordingHour = timesheetRecordingHours[timesheetRecordingHours.length - 1];
    timesheetRecordingHour.value = '08:00';

    var tableClockInOuts = document.querySelectorAll('#TableClockInOut');
    var tableClockInOut = tableClockInOuts[tableClockInOuts.length - 1];
    tableClockInOut.querySelectorAll('select').forEach(e => { e.value = 'ATIVIDADE EXTERNA' });


    var actualManhaDynamicClockInOut = document.querySelectorAll('.dynamicClockInOut')[document.querySelectorAll('.dynamicClockInOut').length - 2];
    var actualTardeDynamicClockInOut = document.querySelectorAll('.dynamicClockInOut')[document.querySelectorAll('.dynamicClockInOut').length - 1];

    actualManhaDynamicClockInOut.querySelector('[placeholder="Entrada"]').value = entradaManha;
    actualManhaDynamicClockInOut.querySelector('[placeholder="Saida"]').value = saidaManha;
    actualTardeDynamicClockInOut.querySelector('[placeholder="Entrada"]').value = entradaTarde;
    actualTardeDynamicClockInOut.querySelector('[placeholder="Saida"]').value = saidaTarde;


    // Seleciona a Data
    var datePickers1 = Array.from(
        document.querySelectorAll('.dynamic .form-control.textbox-date.mask-date.date-picker'))
        .filter(el => !el.hasAttribute('disabled') && !el.classList.contains('date-oncall'));

    $(datePickers1[datePickers1.length - 1]).datepicker('show');

    var content = ("0" + dia).slice(-2); // Valor a ser buscado
    var tdElement = findTdByContent(content);

    if (tdElement) {
        tdElement.click();
    } else {
        console.log(("0" + dia).slice(-2) + '/' + mes + '/' + ano + ' não encontrado no datepicker');
    }

    function findTdByContent(content) {
        var datepickerDropdown = document.querySelector('.datepicker-dropdown');
        
        if (!datepickerDropdown) {
            console.error('Elemento com a classe datepicker-dropdown não encontrado.');
            return null;
        }

        var tdElements = datepickerDropdown.querySelectorAll('td');

        for (var td of tdElements) {
            if (td.innerHTML === content || td.innerText === content) {
                return td; // Retorna o elemento encontrado
            }
        }

        console.warn('Nenhum elemento <td> com o conteúdo especificado foi encontrado.');
        return null; 
    }
    
    $(datePickers1[datePickers1.length - 1]).datepicker('hide');

    // await new Promise(resolve => setTimeout(resolve, 100)); // Aguarda 1 segundo antes de continuar
}