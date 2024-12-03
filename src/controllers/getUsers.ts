import { ObjectId } from "mongodb";

export async function getUsers(req: any, res: any) {
  try {
    const { db } = req.app;

    const result = await db.collection("users").find().toArray();

    res.status(200).json({
      message: "Users retrieved",
      customers: result,
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
      return res
        .status(404)
        .json({ code: "01", message: "Customer not found" });
    }

    res.status(200).json({
      code: "00",
      message: "Customer retrieved",
      customer: result,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
