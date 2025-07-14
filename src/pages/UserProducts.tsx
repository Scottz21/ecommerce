import { useState } from "react";
import { useProductContext } from "../context/ProductContext";
import { auth } from "../firebaseConfig";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// List of static product categories for selection
const categories = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

const UserProducts = () => {
  // Product CRUD and products from context
  const { products, addProduct, updateProduct, deleteProduct } = useProductContext();
  const userId = auth.currentUser?.uid;

  // State for add-product form
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  // State for edit-product form
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState(categories[0]);
  const [editImage, setEditImage] = useState("");

  // Filter for products belonging to this user
  const userProducts = userId
    ? products.filter((p) => p.userId === userId)
    : [];

  // Handle add-product form submission
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields and that price is a number
    if (!title || price === "" || isNaN(Number(price)) || !userId) {
      alert("Please fill out all fields and ensure price is a number.");
      return;
    }
    const newProduct = {
      title,
      price: Number(price),
      description,
      category,
      image,
      userId,
      rating: { rate: 0, count: 0 },
    };
    try {
      await addProduct(newProduct);
      // Clear form on success
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory(categories[0]);
      setImage("");
    } catch (err) {
      alert("Failed to add product: " + err);
      console.error(err);
    }
  };

  // Set state for editing a specific product
  const startEdit = (product: any) => {
    setEditing(product.id);
    setEditTitle(product.title);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditCategory(product.category);
    setEditImage(product.image || "");
  };

  // Handle update-product form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || editPrice === "" || isNaN(Number(editPrice))) {
      alert("Fill out all fields and ensure price is a number.");
      return;
    }
    try {
      await updateProduct(editing, {
        title: editTitle,
        price: Number(editPrice),
        description: editDescription,
        category: editCategory,
        image: editImage,
      });
      // Reset edit state after update
      setEditing(null);
      setEditTitle("");
      setEditPrice("");
      setEditDescription("");
      setEditCategory(categories[0]);
      setEditImage("");
    } catch (err) {
      alert("Failed to update product: " + err);
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Add Product Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" mb={2}>Add a Product</Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleAdd}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            multiline
            minRows={2}
          />
          <TextField
            select
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Image URL"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
          <Button type="submit" variant="contained">Add</Button>
        </Box>
      </Paper>
      {/* User's Products List (with edit/delete actions) */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Your Products</Typography>
        {userProducts.length === 0 && (
          <Typography color="text.secondary">You have no products.</Typography>
        )}
        {userProducts.map((p) => (
          <Box key={p.id} display="flex" alignItems="center" mb={2}>
            {editing === p.id ? (
              // Edit form for this product
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                <TextField
                  size="small"
                  label="Title"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
                <TextField
                  size="small"
                  label="Price"
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                />
                <TextField
                  size="small"
                  label="Description"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  required
                  multiline
                  minRows={2}
                />
                <TextField
                  size="small"
                  select
                  label="Category"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  label="Image URL"
                  value={editImage}
                  onChange={e => setEditImage(e.target.value)}
                />
                <Box display="flex" gap={1} mt={1}>
                  <Button type="submit" size="small" variant="contained" sx={{ mr: 1 }}>Save</Button>
                  <Button size="small" onClick={() => setEditing(null)} variant="outlined">Cancel</Button>
                </Box>
              </form>
            ) : (
              // Product display with edit/delete buttons
              <>
                <Box flex={1}>
                  <Typography>{p.title} - ${p.price}</Typography>
                  <Typography fontSize={14}>{p.description}</Typography>
                  <Typography fontSize={13} color="text.secondary">{p.category}</Typography>
                  {p.image && <img src={p.image} alt={p.title} style={{ maxWidth: 100, marginTop: 4 }} />}
                </Box>
                <IconButton onClick={() => startEdit(p)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => deleteProduct(p.id!)}><DeleteIcon /></IconButton>
              </>
            )}
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default UserProducts;

