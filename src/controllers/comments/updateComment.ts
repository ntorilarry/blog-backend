export async function updateComment(req: any, res: any) {
  try {
    const { db } = req.app as any;
    const { id, postId, content, authorId, rating } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ code: "01", message: "id is required" });
    }
    const existingComment = await db.collection("comments").findOne({ id });
    if (!existingComment) {
      return res.status(404).json({
        code: "01",
        message: "Comment not found",
      });
    }

    const updateData: Partial<{
      content: string;
      rating: number;
      authorId: { id: string; name: string };
      postId: { id: string; name: string };
      modifiedAt: Date;
    }> = {};

    if (content) updateData.content = content;
    if (rating) updateData.rating = rating;

    // Update authorId (if provided)
    let user = null;
    if (authorId) {
      user = await db.collection("users").findOne({ id: authorId });
      if (!user) {
        return res
          .status(404)
          .json({ code: "01", message: "Invalid AuthorId" });
      }
      updateData.authorId = { id: user.id, name: user.name };
    }

    // Update postId (if provided)
    let post = null;
    if (postId) {
      post = await db.collection("blogPost").findOne({ id: postId });
      if (!post) {
        return res.status(404).json({ code: "01", message: "Invalid postId" });
      }
      updateData.postId = { id: post.id, name: post.name };
    }

    updateData.modifiedAt = new Date();

    // Apply the update
    const result = await db
      .collection("comments")
      .updateOne({ id }, { $set: updateData });

    if (!result.matchedCount) {
      throw new Error("Failed to update the comment");
    }

    // Update the comments field of the blog post
    if (postId) {
      const updatedComment = {
        id,
        content: content || existingComment.content,
        rating: rating || existingComment.rating,
        author: {
          id: user?.id || existingComment.authorId.id,
          name: user?.name || existingComment.authorId.name,
        },
        createdAt: existingComment.createdAt,
        modifiedAt: updateData.modifiedAt,
      };

      const updateResult = await db.collection("blogPost").updateOne(
        { id: postId },
        {
          $push: {
            comments: updatedComment,
          },
        }
      );

      if (!updateResult.matchedCount) {
        throw new Error("Failed to update the blog post with the comment");
      }
    }

    const updatedComment = await db.collection("comments").findOne({ id });

    res.status(200).json({
      code: "00",
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
