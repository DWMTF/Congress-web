import { type NextRequest, NextResponse } from "next/server";
import {
  sendPartnershipInquiryNotification,
  sendPartnershipInquiryConfirmation,
  type PartnershipInquiryParams,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const organization =
      typeof body.organization === "string" ? body.organization.trim() : "";
    const tier = typeof body.tier === "string" ? body.tier.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid business email address." },
        { status: 400 }
      );
    }

    if (!organization) {
      return NextResponse.json(
        { error: "Please provide your organization or company name." },
        { status: 400 }
      );
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "Please provide a brief description of your partnership objectives." },
        { status: 400 }
      );
    }

    const inquiryPayload: PartnershipInquiryParams = {
      name,
      email,
      organization,
      tier: tier || "General Partnership Inquiry",
      message,
    };

    // Send admin notification (primary) and user auto-reply (secondary)
    await Promise.all([
      sendPartnershipInquiryNotification(inquiryPayload),
      sendPartnershipInquiryConfirmation(inquiryPayload).catch((err) => {
        console.warn("Auto-reply confirmation email could not be delivered:", err);
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Your partnership inquiry has been received. Our team will connect with you shortly.",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to process inquiry";
    console.error("Partnership inquiry submission error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to send your inquiry at this moment. Please email partnerships@bluemindcongress.org directly.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
