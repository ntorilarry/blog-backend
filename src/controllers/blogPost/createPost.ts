import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to upload to Cloudinary
const uploadImageToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: "blog_posts" },
      (error, result) => {
        if (error) return reject(error);
        if (!result || !result.secure_url)
          return reject(new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

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
      const ratings = null;
      const comments = null;

      const result = await db.collection("blogPost").insertOne({
        id,
        title,
        content,
        image: imageUrl,
        tags: parsedTags,
        authorId: {
          id: user.id,
          name: user.name,
        },
        categoryId: {
          id: category.id,
          name: category.name,
        },
        ratings,
        comments,
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
