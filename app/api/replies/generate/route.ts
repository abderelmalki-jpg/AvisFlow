import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById, getReviewById, getDefaultBrandVoice } from "@/lib/db/queries";
import { createGeneratedReply, incrementBusinessUsage } from "@/lib/db/mutations";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const decoded = await verifyIdToken(token);
    const { businessId, reviewId } = await request.json();

    if (!businessId || !reviewId) {
      return NextResponse.json(
        { error: "Missing businessId or reviewId" },
        { status: 400 }
      );
    }

    // Verify user owns business
    const business = await getBusinessById(businessId);
    if (!business || !business.members[decoded.uid]) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check quota
    if (business.currentMonthUsage >= business.monthlyQuota) {
      return NextResponse.json(
        { error: "Monthly quota exceeded" },
        { status: 429 }
      );
    }

    // Get review
    const review = await getReviewById(businessId, reviewId);
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Get brand voice
    const brandVoice = await getDefaultBrandVoice(businessId);
    if (!brandVoice) {
      return NextResponse.json(
        { error: "No brand voice configured" },
        { status: 400 }
      );
    }

    // Increment usage
    const newUsage = await incrementBusinessUsage(businessId);

    // Generate reply with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build system prompt with brand voice
    const systemPrompt = `${brandVoice.systemPromptSegment}

Here are some examples of good responses:
${brandVoice.examples
  .map(
    (ex, i) => `
Example ${i + 1}:
Review: "${ex.review}"
Response: "${ex.replyTemplate}"
`
  )
  .join("")}

Now, generate a response to this review following the same tone and style:
Rating: ${review.rating}/5
Review: "${review.text}"

Generate only the response text, nothing else.`;

    const result = await model.generateContent(systemPrompt);
    const generatedText =
      result.response.text().trim() ||
      "Thank you for your review! We appreciate your feedback.";

    const generatedReply = await createGeneratedReply(businessId, {
      reviewId,
      brandVoiceId: brandVoice.id,
      generatedText,
      tokenUsage: 0,
    });

    return NextResponse.json({
      success: true,
      reply: generatedReply,
      usageRemaining: business.monthlyQuota - newUsage,
    });
  } catch (error) {
    console.error("Error generating reply:", error);
    return NextResponse.json(
      { error: "Failed to generate reply" },
      { status: 500 }
    );
  }
}
