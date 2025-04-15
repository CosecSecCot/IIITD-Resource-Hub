import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
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
