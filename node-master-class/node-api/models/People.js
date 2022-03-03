class Person {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    sayMyName() {
        return `My name is ${this.name}`;
    }
    sayMyAge() {
        return `I am ${this.age}`;
    }
}

class Emploeey extends Person {
    constructor(name, age, role){
        super(name,age);
        this.role = role;
    }
    sayMyRole(){
        return `My role is ${this.role}`;
    }
}


AllUsers = [
    { 
        id: 1,
        user: new Emploeey('Bcube', 21, 'Analyst')
    },
    { 
        id: 2,
        user: new Emploeey('ECube', 20, 'Developer')
    }
];



exports.Users = AllUsers;