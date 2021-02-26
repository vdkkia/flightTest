const mongoose = require("mongoose");
const assert = require("assert");
const User = require("../../src/models/user");
const request = require("supertest");
const { server, app } = require("../../index");

const user1 = {
  username: "test@flight.com",
  password: "P@ssword!@#",
};
let agent;

const clearCollections = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

const login = async (user, agent) => {
  const { username, password } = user;
  return await agent.post("/api/v1/users/login").send({ username, password });
};

beforeAll(async (done) => {
  await clearCollections();
  await createUser(user1);
  agent = new request.agent(app);
  await login(user1, agent);
  done();
});

afterEach(async () => {});

afterAll((done) => {
  server.close();
  mongoose.disconnect(done);
});

const createUser = async (user) => {
  try {
    return await User.register(new User({ ...user }), user.password);
  } catch (err) {
    console.log(err);
  }
};

describe("flight API", () => {
  it("should add flight", async () => {
    const response = await agent.post("/api/v1/flights/add", { name: "anything" });
    assert.strictEqual(response.statusCode, 200);
  });
  it("should update flight", async () => {
    const response = await agent.patch("/api/v1/flights/update", { name: "anything" });
    assert.strictEqual(response.statusCode, 200);
  });
  it("should remove flight", async () => {
    const response = await agent.del("/api/v1/flights/remove", { name: "anything" });
    assert.strictEqual(response.statusCode, 200);
  });
  it("should search flights", async () => {
    const response = await agent.get("/api/v1/flights/search?name=anything");
    assert.strictEqual(response.statusCode, 200);
  });
});
