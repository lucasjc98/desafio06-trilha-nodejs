import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "Test Name",
      password: "12345",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create an user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "test1@test.com",
        name: "Test Name 1",
        password: "123456",
      });

      await createUserUseCase.execute({
        email: "test1@test.com",
        name: "Test Name 1",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
