const express = require("express");
const cors = require("cors");
const knex = require("knex");
const knexConfig = require("../knexfile");

const app = express();
app.use(express.json());
app.use(cors());

// Инициализация Knex с конфигурацией
const db = knex(knexConfig.development);

// GET /bookings/read - Получить брони за период
app.get("/bookings/read", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = db("bookings").select("*");
    if (startDate) query = query.where("date", ">=", startDate);
    if (endDate) query = query.where("date", "<=", endDate);
    const bookings = await query;
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /bookings/new - Создать новую бронь
app.post("/bookings/new", async (req, res) => {
  try {
    const { tableId, date, employeeId } = req.body;
    if (!tableId || !date || !employeeId ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existing = await db("bookings").where({ tableId, date }).first();
    if (existing) {
      return res
        .status(400)
        .json({ error: "Table is already booked for this date" });
    }
    const [newBooking] = await db("bookings")
      .insert({
        tableId,
        date,
        employeeId,
      })
      .returning("*");
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /bookings/delete - Отменить бронь
app.post("/bookings/delete", async (req, res) => {
  try {
    const { id, employeeId } = req.body;
    if (!id || !employeeId) {
      return res.status(400).json({ error: "Missing id or employeeId" });
    }
    const booking = await db("bookings").where("id", id).first();
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.employeeId !== employeeId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this booking" });
    }
    await db("bookings").where("id", id).del();
    res.json({ message: "Booking canceled" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /login - Имитатор логина по имени
app.post("/login", async (req, res) => {
  try {
    const { employeeName } = req.body;
    if (!employeeName)
      return res.status(400).json({ error: "Name is required" });

    // Простая проверка: ищем или создаём сотрудника
    let employee = await db("employees").where({ name: employeeName }).first();
    if (!employee) {
      const [newEmployee] = await db("employees")
        .insert({
          name: employeeName,
          email: `${employeeName.toLowerCase()}@example.com`,
        })
        .returning("id");
      employee = { id: newEmployee };
    }
    res.json({ employeeId: employee.id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
