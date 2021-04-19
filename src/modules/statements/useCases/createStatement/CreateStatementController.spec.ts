import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Lucas",
      email: "lucas@test.com",
      password: "12345",
    });

    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "usertotest@test.com",
      password: "12345",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "lucas@test.com",
      password: "12345",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "Deposit Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to create a new withdraw statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "lucas@test.com",
      password: "12345",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 250,
        description: "Withdraw Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create a new withdraw statement with insufficient funds", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "lucas@test.com",
      password: "12345",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 260,
        description: "Withdraw Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });

  it("should be able to create a new transfer statement", async () => {
    const responseTokenOne = await request(app).post("/api/v1/sessions").send({
      email: "lucas@test.com",
      password: "12345",
    });

    const responseTokenTwo = await request(app).post("/api/v1/sessions").send({
      email: "usertotest@test.com",
      password: "12345",
    });

    const { token } = responseTokenOne.body;
    const tokenTwo = responseTokenTwo.body.token;

    const user = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${tokenTwo}`,
      });

    const { id } = user.body;

    const response = await request(app)
      .post(`/api/v1/statements/transfer/${id}`)
      .send({
        amount: 250,
        description: "Transfer Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create a new transfer statement with insufficient funds", async () => {
    const responseTokenOne = await request(app).post("/api/v1/sessions").send({
      email: "lucas@test.com",
      password: "12345",
    });

    const responseTokenTwo = await request(app).post("/api/v1/sessions").send({
      email: "usertotest@test.com",
      password: "12345",
    });

    const { token } = responseTokenOne.body;
    const tokenTwo = responseTokenTwo.body.token;

    const user = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${tokenTwo}`,
      });

    const { id } = user.body;

    const response = await request(app)
      .post(`/api/v1/statements/transfer/${id}`)
      .send({
        amount: 250,
        description: "Transfer Supertest",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });
});
