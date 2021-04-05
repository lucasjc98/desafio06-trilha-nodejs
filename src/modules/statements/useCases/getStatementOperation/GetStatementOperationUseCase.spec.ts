import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get statement operation", async () => {
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

    const response = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: user.id!,
    });

    expect(response).toEqual(statement);
  });

  it("should not be able to get statement operation with a no-existent statement", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@test.com",
        name: "Test Name",
        password: "12345",
      });

      await getStatementOperationUseCase.execute({
        statement_id: "12345",
        user_id: user.id!,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to get statement operation with a no-existente user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "12345",
        user_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
});
