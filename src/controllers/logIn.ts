import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function logIn(req: any, res: any) {
  try {
    const { db } = req.app;
    const { email, password } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ code: "01", message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ code: "01", message: "Password is required" });
    }

    // Find the user by email
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(), // Ensure email is lowercase
    });

    if (!user) {
      return res.status(404).json({ code: "01", message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ code: "01", message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id, // Use the custom 'id' field
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET || "your_jwt_secret", // Use environment variable for secret
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return response with token and user details (excluding the password)
    const { password: _, ...userDetails } = user;

    // Return response with token
    res.status(200).json({
      code: "00",
      message: "Login successful",
      token,
      data: userDetails,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ code: "01", error: errorMessage });
  }
}
