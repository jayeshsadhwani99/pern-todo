const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const pool = require("./db");

app.use(cors());
app.use(express.json());

// ROUTES
// Create
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const new_todo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json({
      success: true,
      message: "Added todo successfully",
      data: new_todo.rows[0],
    });
  } catch (e) {
    console.log(`There was an error: ${e?.message ?? e}`);
    res.json({
      success: false,
      error: e?.message ?? e,
      message: "There was an error",
    });
  }
});

// Get All
app.get("/todos", async (req, res) => {
  try {
    const all_todos = await pool.query("SELECT * FROM todo");

    res.json({
      success: true,
      message: "Todos fetched successfully",
      data: all_todos.rows,
    });
  } catch (e) {
    console.log(`There was an error: ${e?.message ?? e}`);
    res.json({
      success: false,
      error: e?.message ?? e,
      message: "There was an error",
    });
  }
});

// Get One
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);

    res.json({
      success: true,
      message: "Todo fetched successfully",
      data: todo.rows[0],
    });
  } catch (e) {
    console.log(`There was an error: ${e?.message ?? e}`);
    res.json({
      success: false,
      error: e?.message ?? e,
      message: "There was an error",
    });
  }
});

// Update
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const upadte_todo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id=$2",
      [description, id]
    );

    res.json({
      success: true,
      message: "Todo updated successfully",
      data: upadte_todo.rows[0],
    });
  } catch (e) {
    console.log(`There was an error: ${e?.message ?? e}`);
    res.json({
      success: false,
      error: e?.message ?? e,
      message: "There was an error",
    });
  }
});

// Delete
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const delete_todo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [
      id,
    ]);

    res.json({
      success: true,
      message: "Todo deleted successfully",
      data: delete_todo.rows[0],
    });
  } catch (e) {
    console.log(`There was an error: ${e?.message ?? e}`);
    res.json({
      success: false,
      error: e?.message ?? e,
      message: "There was an error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
