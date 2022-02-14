/*
  creating a greetins functions 
  inherent from a base ''class'' called person
  
*/

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.grett = function(){
  console.log("my name is " + this.name);
}

function collaborator(name, age, role) {
  Person.call(this, name, age);
  this.role = role;
}

collaborator.prototype = Object.create(Person.prototype);
collaborator.prototype.constructor = collaborator;

const person = new Person("eduardo", 25);
//console.log(edu);
//person.grett()

const colabb = new Emploeey('Eduardooo v2', 25, 'Developer');

colabb.grett() // output like : my name is Eduardooo v2

//with ECMA6 we can do:

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  grett(){
    console.log(`my name is + ${this.name}`);
  }
}

class Collaborator extends Person {
  constructor(name, age, role) {
    super(name, age);
    this.role = role;
  }
}

//to present the same output we can do:

const colabb = new Collaborator("Eduardooo v2", 25, "Developer");
colabb.grett();

//expected output: my name is + Eduardooo v2
