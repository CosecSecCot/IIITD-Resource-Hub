import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function getClerkUserData(userID: string) {
  try {
    const resp = await clerkClient();
    return await resp.users.getUser(userID);
  } catch {
    console.log(`Error getting clerk user, userID: ${userID}`);
    return undefined;
  }
}

export async function getDBUserFromCurrentClerkUser() {
  const user = await currentUser();

  if (!user) return undefined;

  const sql = neon(process.env.DATABASE_URL!);
  const dbUser = (
    await sql`
    SELECT * FROM Users
    WHERE clerkuserid=${user.id}
  `
  )[0];

  return dbUser;
}
