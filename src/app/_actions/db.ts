import { neon } from "@neondatabase/serverless";

export async function getBlogsWithUsers() {
  const sql = neon(process.env.DATABASE_URL!);
  return await sql`
    SELECT * FROM Blog;
  `;
}
