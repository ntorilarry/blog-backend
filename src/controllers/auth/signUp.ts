import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../helpers/sendEmail";

export async function signUp(req: any, res: any) {
  try {
    const { db } = req.app as any;
    const { name, email, phone, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ code: "01", message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ code: "01", message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ code: "01", message: "Password is required" });
    }
    if (!confirmPassword) {
      return res
        .status(400)
        .json({ code: "01", message: "Confirm Password is required" });
    }
    if (!phone) {
      return res.status(400).json({ code: "01", message: "Phone is required" });
    }

    // Validate phone length
    if (phone && phone.length > 10) {
      return res.status(400).json({
        code: "01",
        message: "Phone number cannot be longer than 10 digits",
      });
    }

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        code: "01",
        message: "Passwords do not match",
      });
    }

    // Validate password length and complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        code: "01",
        message:
          "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.",
      });
    }

    // Check if customer exists
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ code: "01", message: "User already exists" });
    }

    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const id = uuidv4();
    const createdAt = new Date();
    const modifiedAt = createdAt;
    const role = "USER";

    // Generate email verification token
    const emailToken = uuidv4();

    // Insert new customer
    const result = await db.collection("users").insertOne({
      id,
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      createdAt,
      modifiedAt,
      role,
      emailVerified: false,
      emailToken,
    });

    if (!result.acknowledged) {
      throw new Error("Registration failed");
    }

    // Send verification email using the helper function
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;
    const emailSubject = "Verify Your Email";
    const emailBody = `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}" target="_blank" style="color: #007BFF; text-decoration: none;">Verify Email</a>
      <p>If you did not request this email, you can safely ignore it.</p>
    </body>
  </html>
`;

    await sendEmail(email, emailSubject, emailBody);

    res.status(200).json({
      code: "00",
      message:
        "Registration successful. Please check your email for verification.",
      data: {
        id,
        name,
        email,
        phone,
        role,
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
