import { v4 as uuidv4 } from "uuid";

export async function createCategory(req: any, res: any) {
  try {
    const { db } = req.app as any;
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ code: "01", message: "Name is required" });
    }

    const id = uuidv4();
    const createdAt = new Date();
    const modifiedAt = createdAt;

    // Insert new customer
    const result = await db.collection("categories").insertOne({
      id,
      name,
      createdAt,
      modifiedAt,
    });

    if (!result.acknowledged) {
      throw new Error("Failed");
    }

    res.status(200).json({
      code: "00",
      message: "Category created successful",
      data: {
        id,
        name,
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
