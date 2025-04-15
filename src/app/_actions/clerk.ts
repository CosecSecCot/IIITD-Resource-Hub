import { clerkClient } from "@clerk/nextjs/server";

export async function getClerkUserData(userID: string) {
  try {
    const resp = await clerkClient();
    return await resp.users.getUser(userID);
  } catch {
    console.log(`Error getting clerk user, userID: ${userID}`);
    return undefined;
  }
}
