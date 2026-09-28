export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${process.env.RESEND_API_KEY}`
        },

        body: JSON.stringify({

          from:
            "Finora <onboarding@resend.dev>",

          to: [email],

          subject:
            "Your Finora Password Reset OTP",

          html: `
            <div style="
              font-family: Arial, sans-serif;
              padding: 20px;
            ">

              <h2>Finora Password Reset</h2>

              <p>
                Your Finora password reset code is:
              </p>

              <h1 style="
                letter-spacing: 8px;
              ">
                ${otp}
              </h1>

              <p>
                This code will expire in 10 minutes.
              </p>

              <p>
                If you did not request this code,
                you can ignore this email.
              </p>

            </div>
          `
        })
      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "RESEND ERROR:",
        errorText
      );

      return res.status(500).json({
        success: false,
        message: "Could not send OTP"
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error(
      "SERVER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
