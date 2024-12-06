import bcrypt from "bcrypt";
import crypto from "crypto";

export async function resetPassword(req: any, res: any) {
  try {
    const { db } = req.app;
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res
        .status(400)
        .json({ code: "01", message: "All fields are required" });
    }

    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ code: "01", message: "User not found" });
    }

    // Verify the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (user.resetToken !== hashedToken || user.resetTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({ code: "01", message: "Invalid or expired token" });
    }

    // Hash new password and update the user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .collection("users")
      .updateOne(
        { email: user.email },
        {
          $set: { password: hashedPassword },
          $unset: { resetToken: "", resetTokenExpiry: "" },
        }
      );

    res.status(200).json({
      code: "00",
      message: "Password has been reset successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}