const { getAllTopics } = require("../../src/controllers/topics.controllers.js");
const { fetchTopicsService } = require("../../src/services/topics.services.js");

jest.mock("../../src/services/topics.services.js", () => ({
  fetchTopicsService: jest.fn(),
}));

describe("getAllTopics Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should send status 200 and topics on success", async () => {
    const mockTopics = [{ slug: "coding", description: "test" }];
    fetchTopicsService.mockResolvedValue(mockTopics);

    await getAllTopics(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ topics: mockTopics });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(err) if the service fails", async () => {
    const mockError = new Error("Database error");
    fetchTopicsService.mockRejectedValue(mockError);

    await getAllTopics(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.send).not.toHaveBeenCalled();
  });
});
