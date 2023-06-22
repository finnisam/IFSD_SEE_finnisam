const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const prompt = require('prompt-sync')();

const app = express();
const port = 3000;

const uri = "mongodb+srv://finnissbsc22:finniss@cluster0.i4wfavp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.json());

class Shop {
  constructor(name, rent) {
    this.name = name;
    this.rent = rent;
  }
}

let db;
let shopsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('ShoppingComplex');
    shopsCollection = db.collection('shops');
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToDatabase();

// Create
app.post('/shops', async (req, res) => {
  const name = prompt('Enter the Name of the Shop: ');
  const rent = Number(prompt('Enter the Rent of the Shop: '));
  const shop = new Shop(name, rent);
  const result = await shopsCollection.insertOne(shop);
  shop._id = result.insertedId;

  res.status(201).json(shop);
});

// Read
app.get('/shops', async (req, res) => {
  const shops = await shopsCollection.find().toArray();
  res.json(shops);
});

// GET - Get a specific player by ID
app.get('/shops/gbn', async (req, res) => {
    const Name = prompt('Enter the shop name: ');
  const shop = await shopsCollection.findOne({name:Name});
  if (shop) {
    res.json(shop);
  } else {
    res.status(404).json({ error: 'Shop not found' });
  }
});

// Update
app.put('/shops/ubn', async (req, res) => {
    const Name = prompt('Enter the shop name: ');
    const Newrent = Number(prompt('Enter the New Rent of the Shop: '));
  const result = await shopsCollection.updateOne(
    {name:Name},
    { $set:{rent:Newrent} }
  );

  if (result.matchedCount > 0) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Shop not found' });
  }
});

// Delete
app.delete('/shops/dbn', async (req, res) => {
    const Name = prompt('Enter the shop name: ');
  const result = await shopsCollection.deleteOne({name:Name});

  if (result.deletedCount > 0) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Shop not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
