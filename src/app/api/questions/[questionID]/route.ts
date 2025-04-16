import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ questionID: string }> },
) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const questionID = parseInt((await params).questionID, 10);
    const { userID, question } = await request.json();

    const result = await sql`
      UPDATE Questions
      SET Content = ${question}
      WHERE QuestionID = ${questionID} AND UserID = ${userID}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Question not found or unauthorized" },
        { status: 404 },
      );
    }

    const updatedQuestion = result[0];

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}
