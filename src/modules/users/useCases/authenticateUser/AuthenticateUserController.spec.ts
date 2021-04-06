import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Lucas",
      email: "lucas3@test.com",
      password: "12345",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "lucas3@test.com",
      password: "12345",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an user with wrong password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "lucas3@test.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });

  it("should not be able to authenticate an user with non-existent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "noexists@test.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });
});
