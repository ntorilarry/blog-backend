export async function getPosts(req: any, res: any) {
  try {
    const { db } = req.app;
    const { page = 1, size = 50, authorId, categoryId } = req.query; // Include authorId and categoryId

    const pageIndex = parseInt(page);
    const pageSize = parseInt(size);

    if (
      isNaN(pageIndex) ||
      isNaN(pageSize) ||
      pageIndex <= 0 ||
      pageSize <= 0
    ) {
      return res.status(400).json({
        code: "01",
        error: "Invalid pagination parameters",
      });
    }

    // Calculate skip and limit
    const skip = (pageIndex - 1) * pageSize;

    // Build query object
    const query: any = {};
    if (authorId) query.authorId = authorId;
    if (categoryId) query.categoryId = categoryId;

    // Get total count of documents matching the query
    const totalItems = await db.collection("blogPost").countDocuments(query);

    // Fetch paginated posts based on query
    const posts = await db
      .collection("blogPost")
      .find(query)
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .toArray();

    res.status(200).json({
      code: "00",
      message: "Posts retrieved",
      totalItems,
      currentPage: pageIndex,
      pageSize,
      data: posts,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}

export async function getPostById(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ code: "01", message: "Post ID is required" });
    }

    const result = await db.collection("blogPost").findOne({
      id: id,
    });

    if (!result) {
      return res.status(404).json({ code: "01", message: "Post not found" });
    }

    res.status(200).json({
      code: "00",
      message: "Post retrieved",
      data: result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
