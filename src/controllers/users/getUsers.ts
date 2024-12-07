export async function getUsers(req: any, res: any) {
  try {
    const { db } = req.app;
    const { page = 1, size = 50 } = req.query; // Default to page 1 and size 10

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

    // Get total count of documents
    const totalItems = await db.collection("users").countDocuments();

    // Fetch paginated users
    const users = await db
      .collection("users")
      .find()
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .toArray();

    res.status(200).json({
      code: "00",
      message: "Users retrieved",
      totalItems,
      currentPage: pageIndex,
      pageSize,
      data: users,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}

export async function getUsersById(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ code: "01", message: "User ID is required" });
    }

    const result = await db.collection("users").findOne({
      id: id,
    });

    if (!result) {
      return res.status(404).json({ code: "01", message: "User not found" });
    }

    res.status(200).json({
      code: "00",
      message: "User retrieved",
      data: result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
