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

const statusMessages: Record<string, string> = {
  pending: "تم استقبال طلبك وهو قيد المراجعة",
  in_progress: "تم البدء في معالجة طلبك",
  resolved: "تم حل طلبك بنجاح",
  rejected: "لم يتمكن الفريق من حل طلبك",
  closed: "تم إغلاق طلبك",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { request_id, status, changed_by, notes } = await req.json();

    if (!request_id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: request, error: fetchError } = await supabase
      .from("requests")
      .select("user_id, title, request_code")
      .eq("id", request_id)
      .maybeSingle();

    if (fetchError || !request) {
      throw new Error("Request not found");
    }

    const message = statusMessages[status] || `تم تحديث حالة طلبك إلى: ${status}`;

    const notification = {
      user_id: request.user_id,
      request_id,
      type: "request_update",
      title: `تحديث: ${request.title}`,
      message: `${message}\n${notes ? `ملاحظات: ${notes}` : ""}`,
      is_read: false,
      action_url: `/requests/${request_id}`,
    };

    const { error: notifyError } = await supabase
      .from("notifications")
      .insert([notification]);

    if (notifyError) {
      console.error("Failed to create notification:", notifyError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
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
