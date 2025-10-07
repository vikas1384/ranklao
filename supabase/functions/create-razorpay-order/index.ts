import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderRequest {
  amount: number; // in INR rupees
  currency?: string; // default INR
  receipt?: string;
  notes?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = "INR", receipt = `rcpt_${Date.now()}`, notes = {} }: CreateOrderRequest = await req.json();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Amount must be a positive number" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const keyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_RQ0SOCkK2HA45Y";
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "jaNx9UN0zOq5gNQadoYtwo2S";

    const authString = btoa(`${keyId}:${keySecret}`);

    // Razorpay expects amount in smallest unit (paise)
    const paiseAmount = Math.round(amount * 100);

    const body = {
      amount: paiseAmount,
      currency,
      receipt,
      notes,
    };

    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Razorpay order error:", data);
      return new Response(JSON.stringify({ error: data?.error?.description || "Failed to create order" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({ success: true, order: data, key_id: keyId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("create-razorpay-order error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);