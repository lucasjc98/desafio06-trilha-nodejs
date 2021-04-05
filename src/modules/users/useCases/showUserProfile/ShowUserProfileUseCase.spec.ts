import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show a user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test Name",
      password: "12345",
    });

    const response = await showUserProfileUseCase.execute(user.id!);

    expect(response).toHaveProperty("id");
  })

  it("should not be able to show an inexistent user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("12345")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});
