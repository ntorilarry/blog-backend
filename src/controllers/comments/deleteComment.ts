export async function deleteComment(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.params;

    const result = await db.collection("comments").deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ code: "01", message: "Comment not found" });
    }

    res.status(200).json({
      code: "00",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}