const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb+srv://finnissbsc22:finniss@cluster0.i4wfavp.mongodb.net/?retryWrites=true&w=majority';
// Database name
const dbName = 'shopping_complex';

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

  // Connect to MongoDB
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();

    console.log("Connected to MongoDB");

    // Get the shopping_complex database
    const db = client.db(dbName);

    // Get the shops collection
    const shopsCollection = db.collection('shops');

    // Clear the existing data in the collection
    await shopsCollection.deleteMany({});

    // Insert the shops into the collection
    for (const shop of complex.shops) {
      await shopsCollection.insertOne(shop);
    }

    console.log("Shops inserted into the collection");

    // Retrieve all shops from the collection
    const retrievedShops = await shopsCollection.find().toArray();
    console.log("Retrieved shops:", retrievedShops);

    // Update the rent of a shop
    const shopToUpdate = retrievedShops[0];
    shopToUpdate.rent = 1500;
    await shopsCollection.updateOne(
      { _id: shopToUpdate._id },
      { $set: { rent: shopToUpdate.rent } }
    );

    console.log("Shop rent updated");

    // Delete a shop
    const shopToDelete = retrievedShops[1];
    await shopsCollection.deleteOne({ _id: shopToDelete._id });

    console.log("Shop deleted");

    // Retrieve all shops after modifications
    const updatedShops = await shopsCollection.find().toArray();
    console.log("Updated shops:", updatedShops);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

main();
