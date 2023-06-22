const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/shopping_complex';
// Schema for the Shop model
const shopSchema = new mongoose.Schema({
  name: String,
  rent: Number
});
// Shop model
const ShopModel = mongoose.model('Shop', shopSchema);

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

async function main() {
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

  try {
    // Connect to MongoDB
    await mongoose.connect(uri);

    console.log("Connected to MongoDB");

    // Clear the existing data in the collection
    await ShopModel.deleteMany({});

    // Insert the shops into the collection
    for (const shop of complex.shops) {
      await ShopModel.create(shop);
    }

    console.log("Shops inserted into the collection");

    // Retrieve all shops from the collection
    const retrievedShops = await ShopModel.find();
    console.log("Retrieved shops:", retrievedShops);

    // Update the rent of a shop
    const shopToUpdate = retrievedShops[0];
    shopToUpdate.rent = 1500;
    await shopToUpdate.save();

    console.log("Shop rent updated");

    // Delete a shop
    const shopToDelete = retrievedShops[1];
    await shopToDelete.delete();

    console.log("Shop deleted");

    // Retrieve all shops after modifications
    const updatedShops = await ShopModel.find();
    console.log("Updated shops:", updatedShops);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

main();
