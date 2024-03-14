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
    const loadLastEventRepository = new LoadLastEventRepositoryMock();
    const checkLastEventStatus = new CheckEventLastStatus(
      loadLastEventRepository
    );

    await checkLastEventStatus.perform("any_group_id");

    // Estou garantindo que o ID que será chamado é exatamente o que foi passado para o repository
    expect(loadLastEventRepository.groupId).toBe("any_group_id");
    expect(loadLastEventRepository.callsCount).toBe(1);
  });
});
