function getData() {
    const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

    const students = [
        {
            first_name: 'Bob',
            last_name: 'Harrison',
            gender: 'Male',
            address:
                '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
            mood: 'Happy',
            country: {name: 'Ireland', code: 'IE'},
        },
        {
            first_name: 'Mary',
            last_name: 'Wilson',
            gender: 'Female',
            age: 11,
            address: '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
            mood: 'Sad',
            country: {name: 'Ireland', code: 'IE'},
        },
        {
            first_name: 'Zahid',
            last_name: 'Khan',
            gender: 'Male',
            age: 12,
            address:
                '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
            mood: 'Happy',
            country: {name: 'Ireland', code: 'IE'},
        },
        {
            first_name: 'Jerry',
            last_name: 'Mane',
            gender: 'Male',
            age: 12,
            address:
                '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
            mood: 'Happy',
            country: {name: 'Ireland', code: 'IE'},
        },
    ];

    // double the array twice, make more data!
    students.forEach((item) => {
        students.push(cloneObject(item));
    });
    students.forEach((item) => {
        students.push(cloneObject(item));
    });
    students.forEach((item) => {
        students.push(cloneObject(item));
    });

    return students;
}
