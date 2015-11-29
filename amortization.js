function getInputs() {
  var loanAmount = Number($("loanAmount").value);
  var interestRate = Number($("interestRate").value);
  var loanLength = Number($("loanLength").value);

  if (isNaN(loanAmount) || loanAmount <= 0) {
    alert("Loan Amount must be a number greater than 0");
    return;
  }

  if (isNaN(interestRate) || interestRate < 1 || interestRate > 100) {
    alert("Interest Rate must be a number between 1 and 100");
    return;
  }

  if (isNaN(loanLength) || loanLength <= 0) {
    alert("Length of Loan must be a number greater than 0");
    return;
  }

  // calc number of months if loan length given in years
  if ($("years").checked) {
    loanLength *= 12;
  }

  amortize(loanAmount,interestRate,loanLength);
}

function amortize(loanAmount, interestRate, loanLength) {
  var monthlyPayment = calcPayment(loanAmount,interestRate,loanLength);
  var amortizationSchedule = createAmortizationSchedule(loanAmount,interestRate,loanLength,monthlyPayment);
  
  // calc totalPaid by using map to create an array of just the 'amount' values from each
  // object in amortizationSchedule, and then use reduce to sum the array of amounts
  var totalPaid = reduce(map(amortizationSchedule, function(element) {
                              return Number(element.amount);
                            }), function(accumulator, element) {
                              return Math.round((accumulator + element) * 100) / 100; // round to 2 decimal places
                        });

  // calc totalInterestPaid by using map to create an array of just the 'interest' values from
  // each object in amortizationSchedule, and then use reduce to sum the array of interest paid
  var totalInterestPaid = reduce(map(amortizationSchedule, function(element) {
                                      return Number(element.interest);
                                    }), function(accumulator, element) {
                                      return Math.round((accumulator + element) * 100) / 100; // round to 2 decimal places
                                });

  buildTable(amortizationSchedule,loanAmount,totalPaid,totalInterestPaid);
}

function calcPayment(loanAmount,interestRate,loanLength) {
  var monthlyPayment = 0;
  var ratePerPeriod = interestRate / 100 / 12;

  monthlyPayment = loanAmount * 
                  (ratePerPeriod * Math.pow(1 + ratePerPeriod,loanLength)) / 
                  (Math.pow(1 + ratePerPeriod, loanLength) - 1);

  // round to 2 decimal places
  monthlyPayment = Math.round(monthlyPayment * 100) / 100;

  return monthlyPayment;
}

function createAmortizationSchedule(loanAmount,interestRate,loanLength,monthlyPayment) {
  var amortizationSchedule = [];
  var balance = loanAmount;
  var ratePerPeriod = interestRate / 100 / 12;
  var interest = 0;
  var principal = 0;
  var paymentDetails = {};

  // create an array of objects, where each object has Payment, Amount, Interest, Principal & Balance properties
  for (var i = 1; i <= loanLength; i++) {
    interest = Math.round(balance * ratePerPeriod * 100) / 100; // round to 2 decimal places

    if (balance > monthlyPayment) {
      principal = monthlyPayment - interest;
      balance -= principal;
    }
    else {  // due to rounding the interest, final payment needs to be adjusted
      principal = balance;
      monthlyPayment = interest + principal;
      balance -= principal;
    }

    paymentDetails = {
      payment:   i,
      amount:    monthlyPayment.toFixed(2),
      interest:  interest.toFixed(2),
      principal: principal.toFixed(2),
      balance:   balance.toFixed(2)
    };

    amortizationSchedule.push(paymentDetails);
  }

  return amortizationSchedule;
}

function buildTable(amortizationSchedule, loanAmount, totalPaid, totalInterestPaid) {
  var tableBody = $("tableBody");
  var tableFooter = $("tableFooter");
  var body = '';
  var footer = '';

  // first table row just shows the loan amount
  body = "<tr><td></td><td></td><td></td><td></td>";
  body += "<td>" + commaSeparatedString(loanAmount.toFixed(2)) + "</td>";
  
  // loop thru each object in the array to build out the table
  each(amortizationSchedule, function(arrayElement) {
    body += "<tr>";  // start table row for object in array
    each(arrayElement, function(objectProp) {
      body += "<td>" + commaSeparatedString(objectProp) + "</td>"; // create table detail for each property value in the object
    })
    body += "</tr>"; // end table row for object in array; loop to next object in array
  });

  footer = "<tr><td></td>";
  footer += "<td>" + commaSeparatedString(totalPaid.toFixed(2)) + "</td>";
  footer += "<td>" + commaSeparatedString(totalInterestPaid.toFixed(2)) + "</td>";
  footer += "</tr>";

  tableBody.innerHTML = body;
  tableFooter.innerHTML = footer;
}

function handleKeyPress(e) {
  var calcButton = $("calculate");

  // 13 is keyCode of 'enter'
  if (e.keyCode === 13) {
    calcButton.click();
    return false;
  }
}

function init() {
  var calcButton = $("calculate");
  calcButton.onclick = getInputs;

  document.addEventListener("keypress", handleKeyPress);
}

window.onload = init;