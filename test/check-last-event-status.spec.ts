import { reset, set } from "mockdate";

type EventStatus = "active" | "done" | "inReview";

type SutOutput = {
  sut: CheckEventLastStatus;
  loadLastEventRepository: LoadLastEventRepositorySpy;
};

// Use Case
class CheckEventLastStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {}

  async perform({ groupId }: { groupId: string }): Promise<EventStatus> {
    const now = new Date();
    const event = await this.loadLastEventRepository.loadLastEvent({ groupId });

    if (event === undefined) return "done";

    return event.endDate >= now ? "active" : "inReview";
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
  output: { endDate: Date; reviewDurationInHours?: number } | undefined;

  async loadLastEvent({
    groupId,
  }: {
    groupId: string;
  }): Promise<{ endDate: Date; reviewDurationInHours?: number } | undefined> {
    this.groupId = groupId;
    this.callsCount++;

    return this.output;
  }
}

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

  it("Should return status active when now is before end time", async () => {
    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() + 1),
    };

    const status = await sut.perform({ groupId });

    expect(status).toBe("active");
  });

  it("Should return status active when now is equal to event end time", async () => {
    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = { endDate: new Date() };

    const status = await sut.perform({ groupId });

    expect(status).toBe("active");
  });

  it("Should return status inReview when now is after event end time", async () => {
    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - 1),
    };

    const status = await sut.perform({ groupId });

    expect(status).toBe("inReview");
  });

  it("Should return status inReview when now is before review time", async () => {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = reviewDurationInHours * 60 * 60 * 1000;

    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs + 1),
      reviewDurationInHours,
    };

    const status = await sut.perform({ groupId });

    expect(status).toBe("inReview");
  });

  it("Should return status inReview when now is equal to review time", async () => {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = reviewDurationInHours * 60 * 60 * 1000;

    const { sut, loadLastEventRepository } = makeSUT();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs),
      reviewDurationInHours,
    };

    const status = await sut.perform({ groupId });

    expect(status).toBe("inReview");
  });
});
