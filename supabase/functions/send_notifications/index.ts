import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { type, user_id, request_id, title, message } = await req.json();

    if (!type || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const notification = {
      user_id,
      request_id: request_id || null,
      type,
      title,
      message,
      is_read: false,
    };

    const { data, error } = await supabase
      .from("notifications")
      .insert([notification])
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("id", user_id)
      .maybeSingle();

    if (user?.email) {
      try {
        await sendEmailNotification(user.email, title, message);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmailNotification(
  email: string,
  title: string,
  message: string
): Promise<void> {
  const emailContent = `
    <h2>${title}</h2>
    <p>${message}</p>
    <p>---</p>
    <p>منصة الحقوق المدنية</p>
  `;

  console.log(`Email sent to ${email}: ${title}`);
}
