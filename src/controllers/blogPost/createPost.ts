import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { uploadImageToCloudinary } from "../../helpers/imageCloudinary";

// Configure Multer
const upload = multer({ storage: multer.memoryStorage() });

export const createPost = [
  upload.single("image"), // Middleware to handle image upload
  async (req: any, res: any) => {
    try {
      const { db } = req.app as any;
      const { title, content, authorId, categoryId, tags } = req.body;

      // Validate required fields
      if (!title) {
        return res
          .status(400)
          .json({ code: "01", message: "Title is required" });
      }
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
      if (!categoryId) {
        return res
          .status(400)
          .json({ code: "01", message: "CategoryId is required" });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ code: "01", message: "Image is required" });
      }

      // Validate tags (if provided)
      const parsedTags = tags ? JSON.parse(tags) : [];
      if (
        parsedTags &&
        (!Array.isArray(parsedTags) ||
          !parsedTags.every((tag) => typeof tag === "string"))
      ) {
        return res
          .status(400)
          .json({ code: "01", message: "Tags must be an array of strings" });
      }

      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(req.file.buffer);

      // Fetch category and user details
      const category = await db
        .collection("categories")
        .findOne({ id: categoryId });
      if (!category) {
        return res
          .status(404)
          .json({ code: "01", message: "Invalid CategoryId" });
      }

      const user = await db.collection("users").findOne({ id: authorId });
      if (!user) {
        return res
          .status(404)
          .json({ code: "01", message: "Invalid AuthorId" });
      }

      const id = uuidv4();
      const createdAt = new Date();
      const modifiedAt = createdAt;

      // Explicitly typed comments array
      const comments: Array<{
        id: string;
        content: string;
        rating: number;
        author: { id: string; name: string };
        createdAt: Date;
      }> = [];

      const likes: Array<{
        id: string;
        author: { id: string; name: string };
        action: boolean;
        createdAt: Date;
      }> = [];

      const result = await db.collection("blogPost").insertOne({
        id,
        title,
        content,
        image: imageUrl,
        tags: parsedTags,
        author: {
          id: user.id,
          name: user.name,
        },
        category: {
          id: category.id,
          name: category.name,
        },
        comments,
        likes,
        createdAt,
        modifiedAt,
      });

      if (!result.acknowledged) {
        throw new Error("Failed to create the post");
      }

      res.status(200).json({
        code: "00",
        message: "Post created successfully",
        data: {
          id,
          title,
          content,
          image: imageUrl,
          tags: parsedTags,
          author: { id: user.id, name: user.name },
          category: { id: category.id, name: category.name },
          comments,
          likes,
          createdAt,
          modifiedAt,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ code: "01", error: errorMessage });
    }
  },
];
