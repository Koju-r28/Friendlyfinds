import { useState } from "react";

const AddItem = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]); // MUST match Multer
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        body: formData // ❗ NO headers
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.message || "Error saving item");
        return;
      }

      alert("Item added successfully!");
      setName("");
      setPrice("");
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Frontend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
