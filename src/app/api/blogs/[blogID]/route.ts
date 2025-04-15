import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: NextRequest,
  { params }: { params: { blogID: string } },
) {
  try {
    const blogID = parseInt(params.blogID, 10);
    const { userID, title, content } = await request.json();

    // Update the blog where BlogID matches.
    const result = await sql`
      UPDATE Blog
      SET Title = ${title}, Content = ${content}
      WHERE BlogID = ${blogID} AND UserID = ${userID}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 },
      );
    }

    const updatedBlog = result[0];

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}
