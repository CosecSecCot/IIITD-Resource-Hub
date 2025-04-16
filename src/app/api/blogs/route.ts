import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { userID, title, content } = await req.json();

    // Insert a new blog. Adjust the table/column names as per your schema.
    const result = await sql`
      INSERT INTO Blog (UserID, Title, Content)
      VALUES (${userID}, ${title}, ${content})
      RETURNING *;
    `;

    // result.rows[0] should be the newly created blog.
    const newBlog = result[0];

    return new Response(JSON.stringify(newBlog), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return new Response(JSON.stringify({ error: "Failed to create blog" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    let result = await sql`
      SELECT 
        b.blogid, b.title, b.content, b.datecreated, b.upvote, b.downvote,
        u.email AS useremail, u.name AS username, u.clerkuserid
      FROM Blog b
      INNER JOIN Users u ON b.userid = u.userid;
    `;

    result = await Promise.all(
      result.map(async (blog) => {
        const clerkData = await getClerkUserData(blog["clerkuserid"]);
        return {
          ...blog,
          userimgurl: clerkData?.imageUrl || "",
        };
      }),
    );

    // Return the rows as JSON.
    return NextResponse.json(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
