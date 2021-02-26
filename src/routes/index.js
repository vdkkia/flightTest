const express = require("express");
const router = express.Router();
const flightsRouter = require("./flights");
const usersRouter = require("./users");

router.use("/api/v1/flights", flightsRouter);
router.use("/api/v1/users", usersRouter);
router.use(
  express.Router().get("/api/v1/*", async (req, res) => {
    res.status(404).send("Not found!");
  })
);

module.exports = router;
