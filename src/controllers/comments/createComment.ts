import { v4 as uuidv4 } from "uuid";

export async function createComment(req: any, res: any) {
  try {
    const { db } = req.app as any;
    const { postId, content, authorId, rating } = req.body;

    // Validate required fields

    if (!content) {
      return res
        .status(400)
        .json({ code: "01", message: "Content is required" });
    }
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

    if (typeof rating !== "number") {
      return res
        .status(400)
        .json({ code: "01", message: "Rating must be a number" });
    }

    const user = await db.collection("users").findOne({ id: authorId });
    if (!user) {
      return res.status(404).json({ code: "01", message: "Invalid AuthorId" });
    }

    const post = await db.collection("blogPost").findOne({ id: postId });
    if (!post) {
      return res.status(404).json({ code: "01", message: "Invalid postId" });
    }

    const id = uuidv4();
    const createdAt = new Date();
    const modifiedAt = createdAt;

    const result = await db.collection("comments").insertOne({
      id,
      content,
      rating,
      postId,
      author: {
        id: user.id,
        name: user.name,
      },
      createdAt,
      modifiedAt,
    });

    if (!result.acknowledged) {
      throw new Error("Failed to create the post");
    }

    // Update the comments field of the blog post
    const updateResult = await db.collection("blogPost").updateOne(
      { id: postId },
      {
        $push: {
          comments: {
            id,
            content,
            rating,
            author: { id: user.id, name: user.name },
            createdAt,
            modifiedAt,
          },
        },
      }
    );

    if (!updateResult.matchedCount) {
      throw new Error("Failed to update the blog post with the comment");
    }

    res.status(200).json({
      code: "00",
      message: "Post created successfully",
      data: {
        id,
        content,
        rating,
        postId,
        author: { id: user.id, name: user.name },
        createdAt,
        modifiedAt,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
