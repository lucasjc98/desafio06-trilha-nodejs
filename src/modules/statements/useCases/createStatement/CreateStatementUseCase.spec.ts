import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test Name",
      password: "12345",
    });

    const statement = await createStatementUseCase.execute({
      amount: 1000,
      description: "Deposit Test",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create an statement with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "Deposit Test",
        type: OperationType.DEPOSIT,
        user_id: "12345",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement with insufficient funds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@test.com",
        name: "Test Name",
        password: "12345",
      });

      await createStatementUseCase.execute({
        amount: 500,
        description: "Withdraw Test",
        type: OperationType.WITHDRAW,
        user_id: user.id!,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
