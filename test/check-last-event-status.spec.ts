// Use Case
class CheckEventLastStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {}

  async perform(groupId: string): Promise<void> {
    this.loadLastEventRepository.loadLastEvent("any_group_id");
  }
}

// interface é um contrato
interface LoadLastEventRepository {
  loadLastEvent: (groupId: string) => Promise<void>;
}

class LoadLastEventRepositoryMock implements LoadLastEventRepository {
  groupId?: string;
  callsCount = 0;

  async loadLastEvent(groupId: string): Promise<void> {
    this.groupId = groupId;
    this.callsCount++;
  }
}

describe("CheckEventLastStatus", () => {
  it(" Should get last event data ", async () => {
    // Arrange
    const loadLastEventRepository = new LoadLastEventRepositoryMock();
    // Por convenção a class a ser testada se chama SUT ( System Under Test )
    const sut = new CheckEventLastStatus(loadLastEventRepository);

    // Act
    await sut.perform("any_group_id");

    // Assert
    // Estou garantindo que o ID que será chamado é exatamente o que foi passado para o repository
    expect(loadLastEventRepository.groupId).toBe("any_group_id");
    expect(loadLastEventRepository.callsCount).toBe(1);
  });
});
