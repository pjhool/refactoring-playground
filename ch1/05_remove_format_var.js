'use strict';

const plays = require('./plays.json');
const invoices = require('./invoices.json');

function statement(invoice, plays) {

    let totalAmount = 0;
    
    let volumeCredits = 0;
    
    let result = `Statement for ${invoice.customer}\n`
    
    for(let perf of invoice.performances) {

        volumeCredits += volumeCreditFor(perf);

        // Print line for this order
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;

        totalAmount += amountFor(perf);
    }

    result += `Amount owed is ${usd(totalAmount)}\n`;

    result += `You earned ${volumeCredits} credits\n`;

    return result;
}

function amountFor(aPerformance) {
    let result = 0;

    switch(playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            
            if(aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }

            break;
        
        case "comedy":
            result = 30000;

            if(aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }

            result += 300 * aPerformance.audience;

            break;

        default:
            throw new Error(`Unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditFor(aPerformance) {
    let result = 0;

    // Add volume credits
    result += Math.max(aPerformance.audience - 30, 0);

    // Add extra credit for every ten comedy attendees
    if("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

    return result;
}

// Change #1 - Extract function
// Change #2 - Change function declaration; from format(aNumber) -> usd(aNumber)
function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
    {
        style: "currency", 
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber/100);
}

// Run the code
const result = statement(invoices[0], plays);
console.log(result);