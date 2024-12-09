import crypto from "crypto";
import { sendEmail } from "../../helpers/sendEmail";

export async function requestPasswordReset(req: any, res: any) {
  try {
    const { db } = req.app;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ code: "01", message: "Email is required" });
    }

    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ code: "01", message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token in the database with an expiration
    const tokenExpiry = Date.now() + 3600000; // 1 hour
    await db
      .collection("users")
      .updateOne(
        { email: user.email },
        { $set: { resetToken: resetTokenHash, resetTokenExpiry: tokenExpiry } }
      );

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;
    await sendEmail(
      user.email,
      "Password Reset",
      `Reset your password here: ${resetLink}`
    );

    res.status(200).json({
      code: "00",
      message: "Password reset link has been sent to your email",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
