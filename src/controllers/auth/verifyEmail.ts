import { Request, Response } from "express";

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { db } = req.app as any;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ code: "01", message: "Token is required" });
    }

    // Find the user by the email verification token
    const user = await db.collection("users").findOne({ emailToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ code: "01", message: "Invalid or expired token" });
    }

    // Update emailVerified to true and remove the emailToken
    const result = await db.collection("users").updateOne(
      { emailToken: token },
      {
        $set: { emailVerified: true, modifiedAt: new Date() },
        $unset: { emailToken: "" },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("Failed to verify email");
    }

    res.status(200).json({
      code: "00",
      message: "Email successfully verified.",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
