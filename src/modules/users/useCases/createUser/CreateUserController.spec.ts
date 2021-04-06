import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@test.com",
      password: "12345",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create an user with existent email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test2@test.com",
      password: "12345",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "Test2",
      email: "test2@test.com",
      password: "12345",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });
});
