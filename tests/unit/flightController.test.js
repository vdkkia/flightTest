const mongoose = require("mongoose");
const assert = require("assert");
const flights = require("../../src/models/flight");
const flightController = require("../../src/controllers/flightController");
const { server } = require("../../index");

const today = new Date();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const clearCollections = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

beforeAll(async (done) => {
  await clearCollections();
  done();
});

afterEach(async () => {
  await clearCollections();
});


afterAll((done) => {
  server.close();
  mongoose.disconnect(done);
});


describe("Flight controller", () => {
  it("should add a flight", async () => {
    await flightController.add(flight1);
    const flightList = await flights.find();
    assert.strictEqual(flightList.length, 1);
  });

  it("should ignore on duplicate flight creation", async () => {
    await flightController.add(flight1);
    await flightController.add(flight1);
    const flightList = await flights.find();
    assert.strictEqual(flightList.length, 1);
  });

  it("should update a flight", async () => {
    await flightController.add(flight1);
    await flightController.update(flight1.name, { number: "BCX8" });
    const flight = await flights.findOne({ name: flight1.name });
    assert.strictEqual(flight.number, "BCX8");
  });

  it("should remove a flight", async () => {
    await flightController.add(flight1);
    await flightController.remove(flight1.name);
    const flight = await flights.findOne({ name: flight1.name });
    assert.strictEqual(flight, null);
  });

  it("should search for a flight", async () => {
    await flightController.add(flight1);
    await flightController.add(flight2);
    const result = await flightController.search("anotherTestFlight", null, null, null, null, 1);
    assert.strictEqual(result.list.length, 1);
    assert.strictEqual(result.totalCount, 1);
  });

  it("should search for a flight by scheduled Date", async () => {
    await flightController.add(flight1);
    await flightController.add(flight2);

    let result = await flightController.search(null, yesterday, today, null, null, 1);
    assert.strictEqual(result.list.length, 1);
    assert.strictEqual(result.totalCount, 1);

    result = await flightController.search(null, yesterday, null, null, null, 1);
    assert.strictEqual(result.list.length, 2);
    assert.strictEqual(result.totalCount, 2);
  });
});

const flight1 = {
  name: "testFlight",
  number: "123A",
  scheduledDate: today,
  arrivalDate: tomorrow,
  departure: "Brugge",
  destination: "Gent",
  fare: "20000",
  duration: 2 * 3600 * 1000,
};

const flight2 = {
  name: "anotherTestFlight",
  number: "B56P",
  scheduledDate: yesterday,
  arrivalDate: today,
  departure: "Paris",
  destination: "Berlin",
  fare: "45000",
  duration: 4 * 3600 * 1000,
};
