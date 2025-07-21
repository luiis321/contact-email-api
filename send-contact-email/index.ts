import { corsHeaders } from "../cors.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      throw new Error("Missing required form fields.");
    }

    const data = await resend.emails.send({
      from: "LisaGravityQueenie <support@lisagravityqueenie.com>",
      to: ["support@lisagravityqueenie.com"],
      subject: `💌 Contact Form: ${subject || "No subject"}`,
      html: `
        <h2 style="color:#6d28d9;">You've got a new message!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "None"}</p>
        <p style="white-space: pre-line;"><strong>Message:</strong><br>${message}</p>
      `,
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
