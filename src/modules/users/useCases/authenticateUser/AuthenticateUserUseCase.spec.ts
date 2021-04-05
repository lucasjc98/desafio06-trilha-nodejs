import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "Test Name",
      password: "12345",
    });

    const response = await authenticateUserUseCase.execute({
      email: "test@test.com",
      password: "12345",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate an non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test1@test.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with invalid password", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "test2@test.com",
        name: "Test Name",
        password: "12345",
      });

      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
