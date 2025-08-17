import { NextResponse } from "next/server";

const endpoint = process.env.FORMSPREE_ENDPOINT;

function isEmail(v: string) {
  // light validation; let Formspree do deeper checks
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    if (!endpoint) {
      return NextResponse.json(
        { ok: false, message: "Server not configured (FORMSPREE_ENDPOINT missing)." },
        { status: 500 }
      );
    }

    // Accept both form and json
    let email = "";
    let source = "site";
    let company = ""; // honeypot

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("form")) {
      const fd = await req.formData();
      email = String(fd.get("email") || "");
      source = String(fd.get("source") || "site");
      company = String(fd.get("company") || "");
    } else {
      const body = await req.json().catch(() => ({}));
      email = String(body.email || "");
      source = String(body.source || "site");
      company = String(body.company || "");
    }

    // Honeypot: silently succeed (pretend ok to bots)
    if (company && company.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, message: "Please enter a valid email." }, { status: 422 });
    }

    // Build form data for Formspree
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("source", source);

    // Optional: forward a bit of context
    const ua = req.headers.get("user-agent") || "";
    formData.append("_user_agent", ua);

    // Server-to-server request (no CORS/origin issues)
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: { 
        'Accept': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // No credentials/cookies
    });

    // Success
    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // Try to surface Formspree error details
    let message = "Couldn't submit. Try again in a moment.";
    try {
      const data = await res.json();
      if (data?.error === "In order to submit via AJAX, you need to set a custom key or reCAPTCHA must be disabled in this form's settings page.") {
        message = "Form configuration issue. Please contact support.";
      } else if (Array.isArray(data?.errors) && data.errors.length) {
        message = data.errors.map((e: any) => e.message).join(", ");
      } else if (data?.message) {
        message = data.message;
      }
    } catch (e) {
      message = `${res.status} ${res.statusText}`;
    }
    return NextResponse.json({ ok: false, message }, { status: 502 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Server error. Please try again shortly." },
      { status: 500 }
    );
  }
}
