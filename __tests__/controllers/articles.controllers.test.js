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
    req = {};
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should send status 200 and articles on sucess", async () => {
    const mockArticles = [{ article_id: "articleId", title: "articleTitle" }];
    fetchArticlesService.mockResolvedValue(mockArticles);

    await getAllArticles(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ articles: mockArticles });
    expect(next).not.toHaveBeenCalled();
  });
});
