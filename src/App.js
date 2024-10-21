import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  // Function to handle adding new items
  function handleItems(item) {
    setItems((items) => [...items, item]);
  }

  // Function to handle canceling (removing) an item
  function handleCancel(id) {
    const newItems = items.filter((item) => item.id !== id); // Correct filtering
    setItems(newItems); // Update the state with the new items array
  }
  function handleToggel(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleItems} />
      <PackingList
        items={items}
        onCancel={handleCancel}
        onToggleItem={handleToggel}
      />
      {/* Pass handleCancel */}
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1> 🌱Far Away 💼 </h1>;
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [select, setSelect] = useState(1);

  // Function to handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = {
      description,
      quantity: select,
      packed: false,
      id: Date.now(), // Unique ID based on timestamp
    };
    onAddItem(newItem);

    // Reset form inputs
    setDescription("");
    setSelect(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={select}
        onChange={(e) => setSelect(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onCancel, onToggleItem }) {
  // Accept onCancel prop
  const [SortBy, setSortBy] = useState("input");

  let sortedItems;
  if (SortBy === "input") {
    sortedItems = items;
  }

  if (SortBy === "description") {
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }
  if (SortBy === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onCancel={onCancel}
            onToggleItem={onToggleItem}
          /> // Pass onCancel
        ))}
      </ul>
      <select value={SortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="input">Sort by input order</option>
        <option value="description">Sort by description</option>
        <option value="packed">Sort by packed Status</option>
      </select>
    </div>
  );
}

function Item({ item, onCancel, onToggleItem }) {
  // Accept onCancel prop
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
        <button onClick={() => onCancel(item.id)}>❌</button>{" "}
        {/* Pass item.id */}
      </span>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>start adding items to your packing list 🚀</em>
      </p>
    );
  }
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentagePacked =
    numItems > 0 ? Math.round((packedItems / numItems) * 100) : 0;

  return (
    <footer className="stats">
      <em>
        {percentagePacked === 100
          ? `you got everything! Ready to go + ✈️`
          : `💼 You have ${numItems} item(s) on your list, and you already packed{" "}
        ${packedItems} (${percentagePacked}%).`}
      </em>
    </footer>
  );
}
