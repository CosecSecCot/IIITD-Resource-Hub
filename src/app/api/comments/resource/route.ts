import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { content, userID, resourceID } = await req.json();

    if (!content || !userID || !resourceID) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Use WITH to chain the inserts in one atomic query.
    const result = await sql`
      WITH inserted_comment AS (
        INSERT INTO Comment (Content, UserID)
        VALUES (${content}, ${userID})
        RETURNING commentid, Content, UserID, Date
      )
      INSERT INTO CommentOnResource (CommentID, resourceID)
      SELECT commentid, ${resourceID} FROM inserted_comment
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(
        `Failed to insert comment on resource with resourceid=${resourceID}`,
      );
    }

    const newComment = result[0];
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
