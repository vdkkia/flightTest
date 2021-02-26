const mongoose = require("mongoose");
const assert = require("assert");
const users = require("../../src/models/user");
const { server } = require("../../index");
const userController = require("../../src/controllers/userController");

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


describe("Registration", () => {
  it("should register the user", async () => {
    const password = "Str@ngPAssword123!";
    const username = "newUseremail@email.com";
    await userController.register(username, password);
    const userList = await users.find();
    assert.strictEqual(userList.length, 1);
  });

  it("should reject register if user exist", async () => {
    const password = "Str@ngPAssword123!";
    const username = "newUseremail@email.com";
    await userController.register(username, password);
    await userController.register(username, password);
    const userList = await users.find();
    assert.strictEqual(userList.length, 1);
  });
});
