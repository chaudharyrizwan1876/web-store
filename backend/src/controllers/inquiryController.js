import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSupplierInquiry = async (req, res) => {
  try {
    const { item, details, quantity, unit } = req.body;

    // Validate required fields
    if (!item || !quantity) {
      return res.status(400).json({
        success: false,
        error: "Item and quantity are required",
      });
    }

    // Prepare email content
    const emailContent = `
      <h2>New Supplier Inquiry</h2>
      <p><strong>Item:</strong> ${item}</p>
      <p><strong>Quantity:</strong> ${quantity} ${unit}</p>
      <p><strong>Details:</strong></p>
      <p>${details || "No additional details"}</p>
      <hr />
      <p><em>Received from: WebStore Supplier Inquiry Form</em></p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || "rizwanchaudhary4477@gmail.com",
      subject: `New Supplier Inquiry: ${item}`,
      html: emailContent,
    });

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send inquiry. Please try again later.",
    });
  }
};
