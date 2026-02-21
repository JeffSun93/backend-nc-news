const {
  getAllArticles,
} = require("../../src/controllers/articles.controllers.js");
const {
  fetchArticlesService,
} = require("../../src/services/articles.services.js");

jest.mock("../../src/services/articles.services.js", () => ({
  fetchArticlesService: jest.fn(),
}));

describe("getAllArticles Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should send status 200 and articles on sucess", async () => {
    const mockArticles = [
      {
        article_id: "articleId",
        title: "articleTitle",
        created_at: "10-09-2025",
      },
    ];
    fetchArticlesService.mockResolvedValue(mockArticles);

    await getAllArticles(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ articles: mockArticles });
    expect(next).not.toHaveBeenCalled();
  });
});
