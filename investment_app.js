

window.addEventListener("resize", function(){
    calculate()}, true);

//---------------Disable enter key on text forms
document.addEventListener('keypress', function (e) {
    if (e.code === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
});


//---------------Query chart
let chartContainer = document.getElementById('chart-container');
let chartContext = document.getElementById('myChart').getContext('2d');
var chartType = 'bar';


//---------------Initial amount
var initialAmountSlider = document.getElementById("starting-range");
var initialAmountBox = document.getElementById("start-Amount-TextBox");
var startingValue = parseFloat(initialAmountBox.value);

var setInitialAmount = function (event) {
    let initialAmount = event.target.value;
    initialAmountBox.value = initialAmount;
    initialAmountSlider.value = initialAmount;
    startingValue = parseFloat(initialAmount);
    calculate();
}

initialAmountSlider.oninput = setInitialAmount;
initialAmountBox.oninput = setInitialAmount;

//---------------Years to accumulate
var yearsSlider = document.getElementById("year-range");
var yearsBox = document.getElementById("years-TextBox");
var yearsValue = parseInt(yearsBox.value);

var setYears = function (event) {
    let yearAmount = event.target.value;
    yearsBox.value = yearAmount;
    yearsSlider.value = yearAmount;
    yearsValue = parseInt(yearAmount);
    calculate();
}

yearsSlider.oninput = setYears;
yearsBox.oninput = setYears;


//---------------Return rate

var returnSlider = document.getElementById("return-rate-range");
var returnBox = document.getElementById("return-TextBox");
var returnValue = parseFloat(returnBox.value);

var setReturnRate = function (event) {
    let returnAmount = event.target.value;
    returnBox.value = returnAmount;
    returnSlider.value = returnAmount;
    returnValue = parseFloat(returnAmount);
    calculate();
}

returnSlider.oninput = setReturnRate;
returnBox.oninput = setReturnRate;


//---------------Additional contributions

var additionalSlider = document.getElementById("contribution-range");
var additionalBox = document.getElementById("additional-TextBox");
var additionalValue = parseFloat(additionalBox.value);

var setAdditionalContribution = function (event) {
    let additionalAmount = event.target.value;
    additionalBox.value = additionalAmount;
    additionalSlider.value = additionalAmount;
    additionalValue = parseFloat(additionalAmount);
    calculate();
}

additionalSlider.oninput = setAdditionalContribution;
additionalBox.oninput = setAdditionalContribution;

//---------------Set compounding frequency
let frequency = 1;

document.querySelectorAll('input[name="contribution-button"]')
    .forEach((elem) => {
        elem.addEventListener("change", function (event) {

            if (event.target.value === 'monthly') {
                frequency = 12;
            } else {
                frequency = 1;
            }

            calculate();
        });
    });


//---------------Check that all input values exist
//debugger;
if (typeof startingValue !== undefined && typeof yearsValue !== undefined
    && typeof returnValue !== undefined && typeof additionalValue !== undefined) {
    calculate();
}


//---------------Function round 2 decimals
function round(value) {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2).toFixed(2);
}


//---------------Set up table
function calculate() {
    let tableRef = document.getElementById('myTable');
    tableRef.innerHTML = "";

    let header = tableRef.createTHead();
    let headerRow = header.insertRow(0);

    let yearHeader = headerRow.insertCell(0);
    let startPrincipalHeader = headerRow.insertCell(1);
    let startBalanceHeader = headerRow.insertCell(2);
    let totalContributionsHeader = headerRow.insertCell(3);
    let interestHeader = headerRow.insertCell(4);
    let cumulativeInterestHeader = headerRow.insertCell(5);
    let endBalanceHeader = headerRow.insertCell(6);
    let endPrincipalHeader = headerRow.insertCell(7);

    yearHeader.style.backgroundColor = "#DBEBC0";
    startPrincipalHeader.style.backgroundColor = "#DBEBC0";
    startBalanceHeader.style.backgroundColor = "#DBEBC0";
    totalContributionsHeader.style.backgroundColor = "#DBEBC0";
    interestHeader.style.backgroundColor = "#DBEBC0";
    cumulativeInterestHeader.style.backgroundColor = "#DBEBC0";
    endBalanceHeader.style.backgroundColor = "#DBEBC0";
    endPrincipalHeader.style.backgroundColor = "#DBEBC0";

    yearHeader.innerHTML = "<b>Year</b>";
    startPrincipalHeader.innerHTML = "<b>Start Principal</b>";
    startBalanceHeader.innerHTML = "<b>Start Balance</b>";
    totalContributionsHeader.innerHTML = "<b>Total Contributions</b>";
    interestHeader.innerHTML = "<b>Interest</b>";
    cumulativeInterestHeader.innerHTML = "<b>Cumulative Interest</b>";
    endBalanceHeader.innerHTML = "<b>End Balance</b>";
    endPrincipalHeader.innerHTML = "<b>End Principal</b>";

    let yearArray = [];
    let cumulativeInterestArray = [];
    let totalContributionsArray = [];
    let yearlyContributionsArray = [];
    let startingAmountArray = [];

    let cumulativeInterest = 0;
    let startPrincipal = startingValue;

    for (let i = 1; i <= yearsValue; i++) {

        //add new row to end of table
        let newRow = tableRef.insertRow(-1);

        let yearCell = newRow.insertCell(0);
        let startPrincipalCell = newRow.insertCell(1);
        let startBalanceCell = newRow.insertCell(2);
        let totalContributionsCell = newRow.insertCell(3);
        let interestCell = newRow.insertCell(4);
        let cumulativeInterestCell = newRow.insertCell(5);
        let endBalanceCell = newRow.insertCell(6);
        let endPrincipalCell = newRow.insertCell(7);

        yearCell.style.backgroundColor = "#DBEBC0";
        startPrincipalCell.style.backgroundColor = "#DBEBC0";
        startBalanceCell.style.backgroundColor = "#DBEBC0";
        totalContributionsCell.style.backgroundColor = "#DBEBC0";
        interestCell.style.backgroundColor = "#DBEBC0";
        cumulativeInterestCell.style.backgroundColor = "#DBEBC0";
        endBalanceCell.style.backgroundColor = "#DBEBC0";
        endPrincipalCell.style.backgroundColor = "#DBEBC0";

        let year = i;

        let returnPct = (returnValue / 100);

        let yearlyContributions = additionalValue * i * frequency;
        let totalContributions = startingValue + yearlyContributions;

        let startBalance, interest;
        let endBalance = (startingValue) * (1 + returnPct / frequency) ** (frequency * year) +
            (additionalValue * ((1 + returnPct / frequency) ** (year * frequency) - 1)) / (returnPct / frequency);

        if (startingValue === 0 && i === 1) {
            startBalance = startingValue;
            endBalance = totalContributions;
            interest = endBalance - startBalance - additionalValue * frequency;
        } else if (returnValue === 0 && i===1) {
            startBalance = startingValue;
            totalContributions = startingValue;
            interest = 0;
            endBalance = totalContributions;
        } else if (returnValue === 0) {
            startPrincipal += additionalValue * frequency;
            startBalance = startPrincipal;
            totalContributions = startBalance;
            endBalance = (startPrincipal + additionalValue * frequency);
            interest = 0;
        } else if (i===1) {
            startBalance = startingValue;
            interest = endBalance - startBalance - additionalValue*frequency;
        } else {
            startPrincipal += additionalValue * frequency;
            startBalance = startPrincipal + cumulativeInterest;
            interest = endBalance - startBalance - additionalValue*frequency;
        }

        let endPrincipal = (startPrincipal + additionalValue * frequency);
        cumulativeInterest += interest;

        let yearText = document.createTextNode(year);
        let startPrincipalText = document.createTextNode('$' + round(startPrincipal));
        let startBalanceText = document.createTextNode('$' + round(startBalance));
        let totalContributionsText = document.createTextNode('$' + round(totalContributions));
        let interestText = document.createTextNode('$' + round(interest));
        let cumulativeInterestText = document.createTextNode('$' + round(cumulativeInterest));
        let endBalanceText = document.createTextNode('$' + round(endBalance));
        let endPrincipalText = document.createTextNode('$' + round(endPrincipal));

        yearCell.appendChild(yearText);
        startPrincipalCell.appendChild(startPrincipalText);
        startBalanceCell.appendChild(startBalanceText);
        totalContributionsCell.appendChild(totalContributionsText);
        interestCell.appendChild(interestText);
        cumulativeInterestCell.appendChild(cumulativeInterestText);
        endBalanceCell.appendChild(endBalanceText);
        endPrincipalCell.appendChild(endPrincipalText);

        yearArray[i] = year;
        yearlyContributionsArray[i] = yearlyContributions;
        totalContributionsArray[i] = totalContributions;
        cumulativeInterestArray[i] = cumulativeInterest;
        startingAmountArray[i] = startingValue;

    }

    renderChart(startingAmountArray, yearlyContributionsArray, yearArray, totalContributionsArray, cumulativeInterestArray)
}

function renderChart(startingAmountArray, yearlyContributionsArray, yearArray, totalContributionsArray, cumulativeInterestArray) {
    resetChartCanvas();

    if (chartType === 'bar') {
        drawBarChart(myChart, yearArray, startingAmountArray, yearlyContributionsArray, cumulativeInterestArray);
    } else {
        drawPieChart(myChart, totalContributionsArray, cumulativeInterestArray);
    }
}


function drawBarChart(myChart, yearArray, startingAmountArray, yearlyContributionsArray, cumulativeInterestArray) {

    new Chart('myChart', getBarChartData(yearArray, startingAmountArray, yearlyContributionsArray, cumulativeInterestArray));

}

function drawPieChart(myChart, totalContributionsArray, cumulativeInterestArray) {

    new Chart('myChart', getPieChartData(totalContributionsArray, cumulativeInterestArray));

}

document
    .querySelectorAll('input[name="graph-selection"]')
    .forEach((elem) => {
        elem.addEventListener("change", function (event) {
            chartType = event.target.value;
            calculate();
        });
    });


function resetChartCanvas() {
    chartContainer.innerHTML = '';

    // adds a new <canvas> element inside #chart-container
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'myChart';
    chartContainer.appendChild(canvasElement);
}


function getBarChartData(yearArray, startingAmountArray, yearlyContributionsArray, cumulativeInterestArray) {

    return {
        type: 'bar',
        data: {
            labels: yearArray,
            datasets: [{
                data: startingAmountArray,
                label: "Starting Amount",
                backgroundColor: "#523249",
                hoverBackgroundColor: "#3c042d"
            }, {
                data: yearlyContributionsArray,
                label: "Total Contributions",
                backgroundColor: "#815355",
                hoverBackgroundColor: "#4c1019",
            }, {
                data: cumulativeInterestArray,
                label: "Cumulative Interest",
                backgroundColor: "#C3B299",
                hoverBackgroundColor: "#887969",
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Balance Accumulation (in dollars)'
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        min: 1,
                        maxTicksLimit: 20
                    }
                }
                ],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        callback: function (startPrincipal) {
                            return '$' + startPrincipal;
                        }
                    }
                }]
            }
        }
    }
}

function getPieChartData(totalContributionsArray, cumulativeInterestArray) {

    let totalContributions = additionalValue * yearsValue * frequency;
    let totalInterest = cumulativeInterestArray.slice(-1).pop();

    return {
        type: 'pie',
        data: {
            labels: ['Starting Amount', 'Total Contributions', 'Cumulative Interest'],
            datasets: [{
                data: [startingValue, totalContributions, totalInterest],
                backgroundColor: ["#523249", "#815355", "#C3B299"],
                hoverBackgroundColor: ["#3c042d", "#4c1019", "#887969"]
            }]

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Balance Accumulation (in dollars)'
            }
        }
    }

}
# investment-calculator
