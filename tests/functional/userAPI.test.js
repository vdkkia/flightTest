const mongoose = require("mongoose");
const assert = require("assert");
const User = require("../../src/models/user");
const request = require("supertest");
const redis = require("../../src/database/redis");
const { server, app } = require("../../index");

const user1 = {
  username: "test@flight.com",
  password: "P@ssword!@#",
};

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

  await redis.reset();
  await clearCollections();
  done();
});

afterEach(async () => {
  await redis.reset();
  await clearCollections();
});

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

describe("Authentication", () => {
  it("should login", async () => {
    await createUser(user1);
    const agent = new request.agent(app);
    let response = await login(user1, agent);
    assert.strictEqual(response.statusCode, 200);

    response = await agent.get("/api/v1/flights/search?name=anything");
    assert.strictEqual(response.statusCode, 200);

    const keys = await redis.redisClient.keys("*");
    let userSessionCount = 0;
    for (const k in keys) {
      const session = await redis.get(keys[k]);
      if (session?.passport?.user == user1.username) userSessionCount++;
    }
    assert.strictEqual(userSessionCount, 1);
  });

  it("should forbid anonymous user to user area", async () => {
    const agent = new request.agent(app);
    const response = await agent.get("/api/v1/flights/search");
    assert.strictEqual(response.statusCode, 401);
  });

  it("should access logged in user to user area", async () => {
    await createUser(user1);
    const agent = new request.agent(app);
    await login(user1, agent);
    const response = await agent.get("/api/v1/flights/search");
    assert.strictEqual(response.statusCode, 200);
  });

  it("should reject user with wrong password", async () => {
    await createUser(user1);
    const agent = new request.agent(app);
    const response = await login({ ...user1, password: "123" }, agent);
    assert.strictEqual(response.statusCode, 400);
  });

  it("should reject user with wrong username", async () => {
    await createUser(user1);
    const agent = new request.agent(app);
    const response = await login({ ...user1, username: "fakeUsername" }, agent);
    assert.strictEqual(response.statusCode, 400);
  });
});
