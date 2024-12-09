import cloudinary from "cloudinary";
import multer from "multer";
import { uploadImageToCloudinary } from "../../helpers/imageCloudinary";

// Configure Multer
const upload = multer({ storage: multer.memoryStorage() });

export const updatePost = [
  upload.single("image"), // Middleware to handle image upload (if provided)
  async (req: any, res: any) => {
    try {
      const { db } = req.app as any;
      const { id, title, content, authorId, categoryId, tags } = req.body;

      // Validate post ID
      if (!id) {
        return res
          .status(400)
          .json({ code: "01", message: "Post ID is required" });
      }

      // Check if the post exists
      const existingPost = await db.collection("blogPost").findOne({ id });
      if (!existingPost) {
        return res.status(404).json({
          code: "01",
          message: "Post not found",
        });
      }

      // Validate tags (if provided)
      const parsedTags = tags ? JSON.parse(tags) : null;
      if (
        parsedTags &&
        (!Array.isArray(parsedTags) ||
          !parsedTags.every((tag) => typeof tag === "string"))
      ) {
        return res
          .status(400)
          .json({ code: "01", message: "Tags must be an array of strings" });
      }

      // Handle optional updates
      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;

      // Update authorId (if provided)
      if (authorId) {
        const user = await db.collection("users").findOne({ id: authorId });
        if (!user) {
          return res
            .status(404)
            .json({ code: "01", message: "Invalid AuthorId" });
        }
        updateData.authorId = { id: user.id, name: user.name };
      }

      // Update categoryId (if provided)
      if (categoryId) {
        const category = await db
          .collection("categories")
          .findOne({ id: categoryId });
        if (!category) {
          return res
            .status(404)
            .json({ code: "01", message: "Invalid CategoryId" });
        }
        updateData.categoryId = { id: category.id, name: category.name };
      }

      // Update tags (if provided)
      if (parsedTags) updateData.tags = parsedTags;

      // Handle image update (if provided)
      if (req.file) {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer);
        updateData.image = imageUrl;
      }

      // Update the modifiedAt timestamp
      updateData.modifiedAt = new Date();

      // Apply the update
      const result = await db
        .collection("blogPost")
        .updateOne({ id }, { $set: updateData });

      if (!result.matchedCount) {
        throw new Error("Failed to update the post");
      }

      // Fetch the updated post
      const updatedPost = await db.collection("blogPost").findOne({ id });

      res.status(200).json({
        code: "00",
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ code: "01", error: errorMessage });
    }
  },
];
