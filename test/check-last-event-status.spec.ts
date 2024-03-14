// Use Case
class CheckEventLastStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {}

  async perform(groupId: string): Promise<string> {
    this.loadLastEventRepository.loadLastEvent("any_group_id");
    return "done";
  }
}

// interface é um contrato
interface LoadLastEventRepository {
  loadLastEvent: (groupId: string) => Promise<undefined>;
}

class LoadLastEventRepositorySpy implements LoadLastEventRepository {
  groupId?: string;
  callsCount = 0;
  output: undefined;

  async loadLastEvent(groupId: string): Promise<undefined> {
    this.groupId = groupId;
    this.callsCount++;

    return this.output;
  }
}

describe("CheckEventLastStatus", () => {
  it(" Should get last event data ", async () => {
    // Arrange
    const loadLastEventRepository = new LoadLastEventRepositorySpy();
    // Por convenção a classe a ser testada se chama SUT ( System Under Test )
    const sut = new CheckEventLastStatus(loadLastEventRepository);

    // Act
    await sut.perform("any_group_id");

    // Assert
    // Estou garantindo que o ID que será chamado é exatamente o que foi passado para o repository
    expect(loadLastEventRepository.groupId).toBe("any_group_id");
    // Garante que o método é chamado apenas uma vez
    expect(loadLastEventRepository.callsCount).toBe(1);
  });

  it(" Should return status done when group has no event", async () => {
    // Arrange
    const loadLastEventRepository = new LoadLastEventRepositorySpy();
    loadLastEventRepository.output = undefined;
    // Por convenção a class a ser testada se chama SUT ( System Under Test )
    const sut = new CheckEventLastStatus(loadLastEventRepository);

    // Act
    const status = await sut.perform("any_group_id");

    // Assert
    expect(status).toBe("done");
  });
});
