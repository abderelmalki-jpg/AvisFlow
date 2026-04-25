import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Anthropic } from "@anthropic-ai/sdk";

admin.initializeApp();
const db = admin.firestore();
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Sync reviews from Google Business Profile
export const syncReviews = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const { businessId } = data;

  if (!businessId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "businessId is required"
    );
  }

  try {
    const business = await db.collection("businesses").doc(businessId).get();

    if (!business.exists) {
      throw new functions.https.HttpsError("not-found", "Business not found");
    }

    const businessData = business.data() as any;

    // Verify ownership
    if (businessData.ownerId !== context.auth.uid) {
      throw new functions.https.HttpsError("permission-denied", "Unauthorized");
    }

    // TODO: Call Google Business API to fetch reviews
    // For now, just return success
    return {
      success: true,
      message: "Review sync would happen here",
      reviewsSynced: 0,
    };
  } catch (error) {
    console.error("Error syncing reviews:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to sync reviews"
    );
  }
});

// Generate AI reply
export const generateReply = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const { businessId, reviewId, brandVoiceId, reviewText, rating } = data;

  if (!businessId || !reviewId || !reviewText) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields"
    );
  }

  try {
    // Get brand voice
    const brandVoice = await db
      .collection("businesses")
      .doc(businessId)
      .collection("brandVoices")
      .doc(brandVoiceId)
      .get();

    if (!brandVoice.exists) {
      throw new Error("Brand voice not found");
    }

    const voiceData = brandVoice.data() as any;

    // Build prompt
    const systemPrompt = `You are a helpful AI assistant that generates professional and personalized responses to Google reviews for businesses.

Brand Voice:
${voiceData.description}

Examples of the tone:
${voiceData.examples
  .map((ex: any) => `Review: "${ex.review}"\nReply: "${ex.replyTemplate}"`)
  .join("\n\n")}

${voiceData.systemPromptSegment}`;

    // Generate reply with Claude
    const message = await anthropic.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate a professional reply to this Google review (${rating} stars):

"${reviewText}"

Reply should be concise, warm, and authentic. Keep it under 200 characters.`,
        },
      ],
    });

    const generatedText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Save reply to Firestore
    const replyId = db
      .collection("businesses")
      .doc(businessId)
      .collection("generatedReplies")
      .doc().id;

    await db
      .collection("businesses")
      .doc(businessId)
      .collection("generatedReplies")
      .doc(replyId)
      .update({
        generatedText,
        status: "draft",
        tokenUsage: message.usage.output_tokens,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return {
      success: true,
      replyId,
      generatedText,
      tokenUsage: message.usage.output_tokens,
    };
  } catch (error) {
    console.error("Error generating reply:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate reply"
    );
  }
});

// Publish reply to Google Business Profile
export const publishReply = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const { businessId, replyId, reviewId } = data;

  if (!businessId || !replyId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields"
    );
  }

  try {
    // TODO: Get Google access token
    // TODO: Call Google Business API to publish reply
    // TODO: Create ResponseHistory entry

    return {
      success: true,
      message: "Reply would be published to Google Business Profile",
    };
  } catch (error) {
    console.error("Error publishing reply:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to publish reply"
    );
  }
});

// Reset monthly quotas
export const resetMonthlyQuotas = functions.pubsub
  .schedule("0 0 1 * *") // 1st of month at midnight
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const businesses = await db.collection("businesses").get();

      for (const doc of businesses.docs) {
        await doc.ref.update({
          currentMonthUsage: 0,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log(`Reset quotas for ${businesses.size} businesses`);
      return null;
    } catch (error) {
      console.error("Error resetting quotas:", error);
      throw error;
    }
  });
