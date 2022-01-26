// applying loopp throw items

const items = ["item_1", "banana", "orange", "apple"];

for (iterator=0; iterator < items.length ; iterator++)
{
  console.log(items[iterator]);
}


// breaking laballed loopings:

const items = ["item_1", "banana", "orange", "apple"];

outerLoop:
for (iterator=0; iterator < items.length ; iterator++)
{
  innerLoop:
  for (iterator2 = 0; iterator2 < items.length ; iterator2++)
  {
    console.log(items[iterator2]);
    if (items[iterator] == "orange") break outerLoop;
  }
}

// for of loop

const meta_data = [{1:"nome", 2: "sobrenome" }, {1:"nome2", 2: "sobrenome2" }];

for (const meta_data_item of meta_data) {
  console.log(meta_data_item);
}
// console log result: 
// {1: 'nome', 2: 'sobrenome'}
// {1: 'nome2', 2: 'sobrenome2'}
