import React, { useState } from 'react';

// Shop component
function Shop({ name, rent, onDelete, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newRent, setNewRent] = useState(rent);

  const handleDelete = () => {
    onDelete();
  };

  const handleUpdate = () => {
    onUpdate(newName, newRent);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          value={newRent}
          onChange={(e) => setNewRent(parseInt(e.target.value))}
        />
        <button onClick={handleUpdate}>Update</button>
      </div>
    );
  } else {
    return (
      <div>
        <p>{name} - {rent}</p>
        <button onClick={() => setEditMode(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    );
  }
}

// ShoppingComplex component
function ShoppingComplex() {
  const [shops, setShops] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRent, setNewRent] = useState(0);

  const handleAddShop = () => {
    const shop = { name: newName, rent: newRent };
    setShops([...shops, shop]);
    setNewName('');
    setNewRent(0);
  };

  const handleDeleteShop = (index) => {
    const updatedShops = [...shops];
    updatedShops.splice(index, 1);
    setShops(updatedShops);
  };

  const handleUpdateShop = (index, name, rent) => {
    const updatedShops = [...shops];
    updatedShops[index] = { name, rent };
    setShops(updatedShops);
  };

  const totalRent = shops.reduce((total, shop) => total + shop.rent, 0);

  return (
    <div>
      <h1>Shopping Complex</h1>
      <h2>Add Shop</h2>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="number"
        value={newRent}
        onChange={(e) => setNewRent(parseInt(e.target.value))}
        placeholder="Rent"
      />
      <button onClick={handleAddShop}>Add Shop</button>
      <h2>Shops</h2>
      {shops.map((shop, index) => (
        <Shop
          key={index}
          name={shop.name}
          rent={shop.rent}
          onDelete={() => handleDeleteShop(index)}
          onUpdate={(name, rent) => handleUpdateShop(index, name, rent)}
        />
      ))}
      <h2>Total Rent</h2>
      <p>{`Total rent of all shops: ${totalRent}`}</p>
    </div>
  );
}

export default ShoppingComplex;
