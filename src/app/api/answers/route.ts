import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { questionID, userID, content } = await req.json();
    const result = await sql`
      INSERT INTO Answers (QuestionID, UserID, Content)
      VALUES (${questionID}, ${userID}, ${content})
      RETURNING *;
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (err) {
    console.error("Error posting answer:", err);
    return NextResponse.json(
      { error: "Failed to post answer" },
      { status: 500 },
    );
  }
}
