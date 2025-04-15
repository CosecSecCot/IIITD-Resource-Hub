import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    // Verify the incoming webhook.
    const evt = await verifyWebhook(req);

    console.log(`Received webhook of type ${evt.type}`);
    console.log("Webhook payload:", evt.data);

    // Handle the user.created event: Insert the user into your DB.
    if (evt.type === "user.created") {
      // Extract the email from the payload.
      // According to your payload structure, the email_addresses field is an array.
      const email = evt.data.email_addresses[0]?.email_address;

      // If email is missing, don't proceed.
      if (!email) {
        console.error("No email provided in the webhook payload.");
        return new Response("Missing email", { status: 400 });
      }

      // Check if the email matches the required domain.
      if (!email.toLowerCase().endsWith("@iiitd.ac.in")) {
        console.log(
          `Email ${email} does not match the required domain. Skipping registration.`,
        );
        return new Response("Email domain not allowed", { status: 200 });
      }

      // Extract name fields and construct the full name.
      const firstName = evt.data.first_name || "";
      const lastName = evt.data.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Anonymous";
      const userID = evt.data.id;

      // Insert the new user into the Users table.
      await sql`
        INSERT INTO Users (Name, Email, ClerkUserID)
        VALUES (${fullName}, ${email}, ${userID})
        ON CONFLICT (Email) DO NOTHING
      `;

      console.log("User inserted:", fullName, email);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
