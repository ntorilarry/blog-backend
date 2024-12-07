export async function updateCategory(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id, name } = req.body; // Get id and name from request body

    // Validate required fields
    if (!id) {
      return res.status(400).json({ code: "01", message: "ID is required" });
    }
    if (!name) {
      return res.status(400).json({ code: "01", message: "Name is required" });
    }

    const modifiedAt = new Date(); // Capture the current timestamp

    // Update category in the database
    const result = await db.collection("categories").updateOne(
      { id },
      {
        $set: {
          name,
          modifiedAt, // Existing field
        },
      }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ code: "01", message: "Category not found" });
    }

    res.status(200).json({
      code: "00",
      message: "Category updated successfully",
      data: { id, name, modifiedAt },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
