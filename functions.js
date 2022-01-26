const multiplier = function  (multiplier, ...numbers) {
  return numbers.map( n => multiplier*n );
}


// some carefull step when using function and the THIS context

function Dog(name, age) {
  this.name = name;
  this.age = age;
  setInterval( function () {
    this.age += 1;
  }, 2000);
}

// is different from 


function Dog(name, age) {
  this.name = name;
  this.age = age;
  setInterval( () => {
    this.age += 1;
  }, 2000);
}

//because arrow functions do not define new context for this.
