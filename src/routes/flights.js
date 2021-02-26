const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const flightController = require("../controllers/flightController");

// TO-DO: Use JOI to validate req.body
router.post("/add", auth, async (req, res) => {
  try {
    await flightController.add(req.body);
    return res.status(200).json({ message: "The flight was added successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.patch("/update", auth, async (req, res) => {
  try {
    await flightController.update(req.body.name);
    return res.status(200).json({ message: "The flight was updated successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.delete("/remove", auth, async (req, res) => {
  try {
    await flightController.remove(req.body.name);
    return res.status(200).json({ message: "The flight was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const { name, scheduledDateStart, scheduledDateEnd, departure, destination, page } = req.query;
    res.send(
      await flightController.search(name, scheduledDateStart, scheduledDateEnd, departure, destination, page)
    );
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
