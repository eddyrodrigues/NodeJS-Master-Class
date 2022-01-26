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


