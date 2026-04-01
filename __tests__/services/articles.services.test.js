const {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticleService,
  addCommentByArticleService,
  updateVoteByArticleService,
} = require("../../src/services/articles.services.js");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
  updateVoteByArticle,
  checkTopicExist,
} = require("../../src/models/articles.models.js");
const {
  isDatabaseError,
  handleDatabaseError,
} = require("../../src/errors/dbErrorHandler.js");
const {
  BadRequestError,
  NotFoundError,
  CustomError,
} = require("../../src/errors/customError.js");
const { ERROR_MSG } = require("../../src/constants/index.js");

jest.mock("../../src/models/articles.models.js", () => ({
  selectAllArticles: jest.fn(),
  selectArticleById: jest.fn(),
  selectCommentsByArticle: jest.fn(),
  insertCommentByArticle: jest.fn(),
  updateVoteByArticle: jest.fn(),
  checkTopicExist: jest.fn(),
}));

jest.mock("../../src/errors/dbErrorHandler.js", () => ({
  isDatabaseError: jest.fn(),
  handleDatabaseError: jest.fn(),
}));

describe("articles services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isDatabaseError.mockReturnValue(false);
  });

  describe("fetchArticlesService", () => {
    it("returns articles when sort/order/topic are valid", async () => {
      const mockArticles = [{ article_id: 1 }];
      checkTopicExist.mockResolvedValue(true);
      selectAllArticles.mockResolvedValue(mockArticles);

      const result = await fetchArticlesService("created_at", "DESC", "mitch");

      expect(checkTopicExist).toHaveBeenCalledWith("mitch");
      expect(selectAllArticles).toHaveBeenCalledWith(
        "created_at",
        "DESC",
        "mitch",
      );
      expect(result).toEqual(mockArticles);
    });

    it("throws NotFoundError when topic does not exist", async () => {
      checkTopicExist.mockResolvedValue(false);

      await expect(
        fetchArticlesService("created_at", "DESC", "not-a-topic"),
      ).rejects.toThrow(NotFoundError);
      await expect(
        fetchArticlesService("created_at", "DESC", "not-a-topic"),
      ).rejects.toThrow(ERROR_MSG.TOPIC_NOT_FOUND);
    });

    it("throws BadRequestError for invalid sort_by", async () => {
      await expect(fetchArticlesService("bad_column", "DESC")).rejects.toThrow(
        BadRequestError,
      );
      expect(selectAllArticles).not.toHaveBeenCalled();
    });
  });

  describe("fetchArticleByIdService", () => {
    it("returns article when found", async () => {
      const article = { article_id: 1, title: "Living in the shadow" };
      selectArticleById.mockResolvedValue(article);

      const result = await fetchArticleByIdService(1);

      expect(result).toEqual(article);
      expect(selectArticleById).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when article does not exist", async () => {
      selectArticleById.mockResolvedValue(undefined);

      await expect(fetchArticleByIdService(9999)).rejects.toThrow(
        NotFoundError,
      );
      await expect(fetchArticleByIdService(9999)).rejects.toThrow(
        ERROR_MSG.ARTICLE_NOT_FOUND,
      );
    });
  });

  describe("fetchCommentsByArticleService", () => {
    it("returns comments for an existing article", async () => {
      const comments = [{ comment_id: 1 }];
      selectCommentsByArticle.mockResolvedValue(comments);
      selectArticleById.mockResolvedValue({ article_id: 1 });

      const result = await fetchCommentsByArticleService(1);

      expect(result).toEqual(comments);
      expect(selectCommentsByArticle).toHaveBeenCalledWith(1);
      expect(selectArticleById).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when article does not exist", async () => {
      selectCommentsByArticle.mockResolvedValue([]);
      selectArticleById.mockResolvedValue(undefined);

      await expect(fetchCommentsByArticleService(9999)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("addCommentByArticleService", () => {
    it("returns inserted comment on success", async () => {
      const inserted = { comment_id: 19, body: "Great" };
      insertCommentByArticle.mockResolvedValue(inserted);

      const result = await addCommentByArticleService(
        1,
        "butter_bridge",
        "Great",
      );

      expect(result).toEqual(inserted);
      expect(insertCommentByArticle).toHaveBeenCalledWith(
        1,
        "butter_bridge",
        "Great",
      );
    });

    it("maps FK article errors to Article not found", async () => {
      const dbErr = {
        code: "23503",
        detail: 'Key (article_id)=(9999) is not present in table "articles".',
      };
      insertCommentByArticle.mockRejectedValue(dbErr);
      isDatabaseError.mockReturnValue(true);

      await expect(
        addCommentByArticleService(9999, "butter_bridge", "Great"),
      ).rejects.toThrow(ERROR_MSG.ARTICLE_NOT_FOUND);
    });

    it("maps FK author errors to User not found", async () => {
      const dbErr = {
        code: "23503",
        detail: 'Key (author)=(no_user) is not present in table "users".',
      };
      insertCommentByArticle.mockRejectedValue(dbErr);
      isDatabaseError.mockReturnValue(true);

      await expect(
        addCommentByArticleService(1, "no_user", "Great"),
      ).rejects.toThrow(ERROR_MSG.USER_NOT_FOUND);
    });

    it("uses generic db error handler for other database errors", async () => {
      const dbErr = { code: "22P02" };
      const mapped = new CustomError(
        "Invalid data format. Please check your input.",
        400,
      );
      insertCommentByArticle.mockRejectedValue(dbErr);
      isDatabaseError.mockReturnValue(true);
      handleDatabaseError.mockReturnValue(mapped);

      await expect(
        addCommentByArticleService(1, "butter_bridge", "Great"),
      ).rejects.toBe(mapped);
      expect(handleDatabaseError).toHaveBeenCalledWith(dbErr);
    });
  });

  describe("updateVoteByArticleService", () => {
    it("returns updated article on success", async () => {
      const updated = { article_id: 1, votes: 101 };
      updateVoteByArticle.mockResolvedValue({ article: updated, rowCount: 1 });

      const result = await updateVoteByArticleService(1, 1);

      expect(result).toEqual(updated);
      expect(updateVoteByArticle).toHaveBeenCalledWith(1, 1);
    });

    it("throws BadRequestError when inc_votes is missing", async () => {
      await expect(updateVoteByArticleService(1, undefined)).rejects.toThrow(
        BadRequestError,
      );
    });

    it("throws NotFoundError when rowCount is zero", async () => {
      updateVoteByArticle.mockResolvedValue({
        article: undefined,
        rowCount: 0,
      });

      await expect(updateVoteByArticleService(9999, 1)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("maps database errors via handleDatabaseError", async () => {
      const dbErr = { code: "22P02" };
      const mapped = new CustomError(
        "Invalid data format. Please check your input.",
        400,
      );
      updateVoteByArticle.mockRejectedValue(dbErr);
      isDatabaseError.mockReturnValue(true);
      handleDatabaseError.mockReturnValue(mapped);

      await expect(updateVoteByArticleService(1, 1)).rejects.toBe(mapped);
    });
  });
});
