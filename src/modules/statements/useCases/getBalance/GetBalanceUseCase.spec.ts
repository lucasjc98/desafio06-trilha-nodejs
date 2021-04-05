import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance", async () => {
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

    const response = await getBalanceUseCase.execute({
      user_id: user.id!,
    });

    expect(response.balance).toEqual(statement.amount);
  });

  it("should not be able to get balance of non-existent user", async () => {
    expect(async () => {
      const response = await getBalanceUseCase.execute({
        user_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
