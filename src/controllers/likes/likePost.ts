export async function likePost(req: any, res: any) {
  try {
    const { db } = req.app as any;
    const { postId, authorId, action } = req.body;

    if (!authorId) {
      return res
        .status(400)
        .json({ code: "01", message: "AuthorId is required" });
    }

    if (!postId) {
      return res
        .status(400)
        .json({ code: "01", message: "PostId is required" });
    }

    if (typeof action !== "boolean") {
      return res
        .status(400)
        .json({ code: "01", message: "Action must be a boolean" });
    }

    const user = await db.collection("users").findOne({ id: authorId });
    if (!user) {
      return res.status(404).json({ code: "01", message: "Invalid AuthorId" });
    }

    const post = await db.collection("blogPost").findOne({ id: postId });
    if (!post) {
      return res.status(404).json({ code: "01", message: "Invalid PostId" });
    }

    const createdAt = new Date();
    const modifiedAt = createdAt;
    if (action) {
      // Like the post
      const updateResult = await db.collection("blogPost").updateOne(
        { id: postId },
        {
          $addToSet: { likes: { id: authorId, name: user.name } },
          $inc: { likesCount: 1 },
          $set: { modifiedAt: createdAt },
        }
      );

      if (!updateResult.matchedCount) {
        throw new Error("Failed to like the post");
      }

      return res.status(200).json({
        code: "00",
        message: "Post liked successfully",
        data: {
          postId,
          author: { id: user.id, name: user.name },
          action: "like",
          createdAt,
          modifiedAt,
        },
      });
    } else {
      // Unlike the post
      const updateResult = await db.collection("blogPost").updateOne(
        { id: postId },
        {
          $pull: { likes: { id: authorId } },
          $inc: { likesCount: -1 },
          $set: { modifiedAt: createdAt },
        }
      );

      if (!updateResult.matchedCount) {
        throw new Error("Failed to unlike the post");
      }

      return res.status(200).json({
        code: "00",
        message: "Post unliked successfully",
      });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
