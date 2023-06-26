var numRows = 500;

var names = [
    'Aden Moreno',
    'Alton Watson',
    'Caleb Scott',
    'Cathy Wilkins',
    'Charlie Dodd',
    'Jermaine Price',
    'Reis Vasquez',
];

var phones = [
    { handset: 'Huawei P40', price: 599 },
    { handset: 'Google Pixel 5', price: 589 },
    { handset: 'Apple iPhone 12', price: 849 },
    { handset: 'Samsung Galaxy S10', price: 499 },
    { handset: 'Motorola Edge', price: 549 },
    { handset: 'Sony Xperia', price: 279 },
];

export function getData(): any[] {
    var data = [];
    for (var i = 0; i < numRows; i++) {
        var phone = phones[getRandomNumber(0, phones.length)];
        var saleDate = randomDate(new Date(2020, 0, 1), new Date(2020, 11, 31));

        data.push({
            salesRep: names[getRandomNumber(0, names.length)],
            handset: phone.handset,
            sale: phone.price,
            saleDate: saleDate
        });
    }
    return data;
}

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomDate(start: Date, end: Date) {
    var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().substring(0, 10);
}