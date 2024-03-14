import { reset, set } from "mockdate";

// Use Case
class CheckEventLastStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {}

  async perform({ groupId }: { groupId: string }): Promise<string> {
    const event = await this.loadLastEventRepository.loadLastEvent({ groupId });

    const result = event === undefined ? "done" : "active";
    return result;
  }
}

// interface é um contrato
interface LoadLastEventRepository {
  loadLastEvent: (input: {
    groupId: string;
  }) => Promise<{ endDate: Date } | undefined>;
}

class LoadLastEventRepositorySpy implements LoadLastEventRepository {
  groupId?: string;
  callsCount = 0;
  output: { endDate: Date } | undefined;

  async loadLastEvent({
    groupId,
  }: {
    groupId: string;
  }): Promise<{ endDate: Date } | undefined> {
    this.groupId = groupId;
    this.callsCount++;

    return this.output;
  }
}

type SutOutput = {
  sut: CheckEventLastStatus;
  loadLastEventRepository: LoadLastEventRepositorySpy;
};
const makeSUT = (): SutOutput => {
  // Arrange
  const loadLastEventRepository = new LoadLastEventRepositorySpy();
  // Por convenção a classe a ser testada se chama SUT ( System Under Test )
  const sut = new CheckEventLastStatus(loadLastEventRepository);

  return { sut, loadLastEventRepository };
};

describe("CheckEventLastStatus", () => {
  const groupId = "any_group_id";

  // Antes de todos
  beforeAll(() => {
    set(new Date());
  });

  // Depois de todos
  afterAll(() => {
    reset();
  });

  it("Should get last event data ", async () => {
    // Arrange
    // Por convenção a class a ser testada se chama SUT ( System Under Test )
    const { sut, loadLastEventRepository } = makeSUT();

    // Act
    await sut.perform({ groupId });

    // Assert
    // Estou garantindo que o ID que será chamado é exatamente o que foi passado para o repository
    expect(loadLastEventRepository.groupId).toBe(groupId);
    // Garante que o método é chamado apenas uma vez
    expect(loadLastEventRepository.callsCount).toBe(1);
  });

  it("Should return status done when group has no event", async () => {
    // Arrange
    // Por convenção a class a ser testada se chama SUT ( System Under Test )
    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = undefined;

    // Act
    const status = await sut.perform({ groupId });

    // Assert
    expect(status).toBe("done");
  });

  it("Should return status active when now id before and time", async () => {
    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() + 1),
    };

    const status = await sut.perform({ groupId });

    expect(status).toBe("active");
  });
});
