'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;


class Province {
    constructor(doc) {
        this._name = doc.name;
        this._producers = [];
        this._totalProduction = 0;
        this._demand = doc.demand;
        this._price = doc.price;
        
        doc.producers.forEach(producer => this.addProducer(
            new Producer(this, producer)
        ));
    }

    addProducer(arg) {
        this._producers.push(arg);
        this._totalProduction += arg.production;
    }

    get name() { return this._name; }
    get producers() { return this._producers.slice(); }

    get totalProduction() { return this._totalProduction; }
    set totalProduction(arg) { return this._totalProduction = arg; }

    get demand() { return this._demand; }
    set demand(arg) { return this._demand = parseInt(arg); }

    get price() { return this._price; }
    set price(arg) { return this._price = parseInt(arg); }

    get shortfall() { return this._demand - this.totalProduction; }

    get profit() { return this.demandValue - this.demandCost; }
    get demandCost() {
        let remainingDemand = this.demand;
        let result = 0;
        this.producers
            .sort((a, b) => a.cost - b.cost)
            .forEach(producer => {
                const contribution = Math.min(remainingDemand, producer.production);
                remainingDemand -= contribution;
                result += contribution * producer.cost;
            })

        return result;
    }
    get demandValue() { return this.satisfiedDemand * this.price; }
    get satisfiedDemand() { return Math.min(this._demand, this.totalProduction); }
}

function sampleProvinceData() {
    return {
        name: "Asia",
        producers: [
            { name: "Byzantium", cost: 10, production: 9 },
            { name: "Attalia", cost: 12, production: 10 },
            { name: "Sinope", cost: 10, production: 6 },
        ],
        demand: 30,
        price: 20
    };
}

class Producer {
    constructor(aProvince, data) {
        this._province = aProvince;
        this._cost = data.cost;
        this._name = data.name;
        this._production = data.production || 0;
    }

    get name() { return this._name; }
    
    get cost() { return this._cost; }
    set cost(arg) { this._cost = parseInt(arg); }

    get production() { return this._production; }
    set production(amountStr) {
        const amount = parseInt(amountStr);
        const newProduction = Number.isNaN(amount) ? 0 : amount;
        this._province.totalProduction += newProduction - this._production;
        this._production = newProduction;
    }
}

/** TEST CASES */
describe('province', () => {
    let asia;
    beforeEach(() => {
        asia = new Province(sampleProvinceData());
    })
    it('shortfall', () => {
        expect(asia.shortfall).equal(5);
    })

    it('profit', () => {
        expect(asia.profit).equal(230);
    })
    it('change production', () => {
        asia.producers[0].production = 20;

        expect(asia.shortfall).equal(-6);
        expect(asia.profit).equal(292);
    })
    it('zero demand', () => {
        asia.demand = 0;

        expect(asia.shortfall).equal(-25);
        expect(asia.profit).equal(0);
    })
    it('negative demand', () => {
        asia.demand = -1;

        expect(asia.shortfall).equal(-26);
        expect(asia.profit).equal(-10);
    })
    it('empty string demand', () => {
        asia.demand = '';

        expect(asia.shortfall).NaN;
        expect(asia.profit).NaN;
    })
})

describe('no producers', () => {
    let noProducers;

    beforeEach(() => {
        const data = {
            name: 'No producers',
            producers: [],
            demand: 30,
            price: 20,
        };

        noProducers = new Province(data);
    });

    it('shortfall', () => {
        expect(noProducers.shortfall).equal(30);
    })

    it('profit', () => {
        expect(noProducers.profit).equal(0);
    })
})

// True Negative test case
// describe('string for producers', () => {
//     it('', () => {
//         const data = {
//             name: 'String producers',
//             producers: '',
//             demand: 30,
//             price: 20,
//         };

//         const prov = new Province(data);

//         expect(prov.shortfall).equal(0);
//     });
// })