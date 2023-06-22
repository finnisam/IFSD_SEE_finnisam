const prompt = require('prompt-sync')();
class Shop {
  constructor(name, rent) {
    this.name = name;
    this.rent = rent;
  }
}

class ShoppingComplex {
  constructor() {
    this.shops = [];
  }

  addShop(shop) {
    this.shops.push(shop);
  }

  getTotalRent() {
    let totalRent = 0;
    for (let i = 0; i < this.shops.length; i++) {
      totalRent += this.shops[i].rent;
    }
    return totalRent;
  }
}

function main() {
  const complex = new ShoppingComplex();

  const numShops = parseInt(prompt("Enter the number of shops:"));

  for (let i = 0; i < numShops; i++) {
    const name = prompt(`Enter the name of shop ${i + 1}:`);
    const rent = parseInt(prompt(`Enter the rent of shop ${i + 1}:`));

    const shop = new Shop(name, rent);
    complex.addShop(shop);
  }

  const totalRent = complex.getTotalRent();
  console.log("Total rent of all shops:", totalRent);
}

main();
