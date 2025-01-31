import clientPromise from "../../../../lib/mongodb";

export async function GET(request, { params }) {
  const { userid } = params;

  try {
    // Validate userid
    if (!userid || typeof userid !== "string") {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");
    // Fetch only the `reviews` field
    const user = await db.collection("users").findOne(
      { email: new RegExp(`^${userid}$`, "i") },
      { projection: { reviews: 1 } } // Include only the `reviews` field
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user.reviews || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { userid } = params;

  try {
    // Validate userid
    if (!userid || typeof userid !== "string") {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    // Parse the request body
    const { reviewerId, rating, comment } = await request.json();

    // Validate the review data
    if (!reviewerId || typeof reviewerId !== "string" || !rating || typeof rating !== "number" || rating < 1 || rating > 5 || !comment || typeof comment !== "string") {
      return new Response(JSON.stringify({ error: "Invalid review data" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("taskme");

    // Create the review object
    const review = {
      reviewerId,
      rating,
      comment,
      timestamp: new Date(),
    };

    // Update the user's document to add the new review
    const result = await db.collection("users").updateOne(
      { email: new RegExp(`^${userid}$`, "i") },
      { $push: { reviews: review } }
    );

    // Check if the user was found and updated
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Review added successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error adding review:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}