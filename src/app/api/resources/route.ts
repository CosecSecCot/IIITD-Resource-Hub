import { getClerkUserData } from "@/app/_actions/clerk";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const {
      userID,
      title,
      description,
      type,
      subject,
      year,
      semester,
      resourceFiles,
    } = await req.json();

    // Validate required fields (you may also rely on the client/form validation)
    if (
      !userID ||
      !title ||
      !description ||
      !subject ||
      !year ||
      !semester ||
      !resourceFiles ||
      !Array.isArray(resourceFiles)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Start a transaction
    await sql`BEGIN`;

    // Insert into the Resource table
    const resourceResult = await sql`
      INSERT INTO Resource (UserID, Title, Description, Type, Subject, Year, Semester)
      VALUES (${userID}, ${title}, ${description}, ${type}, ${subject}, ${year}, ${semester})
      RETURNING *;
    `;

    if (!resourceResult || resourceResult.length === 0) {
      throw new Error("Failed to create resource");
    }

    const newResource = resourceResult[0];
    const resourceID = newResource["resourceid"];

    // Insert each URL into the ResourceFile table
    for (const url of resourceFiles) {
      // You can optionally check that url is a non-empty string here
      await sql`
        INSERT INTO ResourceFile (URL, ResourceID)
        VALUES (${url}, ${resourceID});
      `;
    }

    // Commit the transaction
    await sql.query("COMMIT");

    return NextResponse.json(newResource, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    try {
      // Roll back the transaction if any step fails.
      await sql.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    let result = await sql`
      SELECT 
        r.resourceid, r.title, r.description, r.type, r.uploaddate, r.subject, r.year, r.semester,
        u.email AS useremail, u.name AS username, u.clerkuserid,
        (SELECT array_agg(url) FROM ResourceFile WHERE resourceid = r.resourceid) AS urls
      FROM Resource r
      INNER JOIN Users u ON r.userid = u.userid;
    `;

    result = await Promise.all(
      result.map(async (resource) => {
        const clerkData = await getClerkUserData(resource["clerkuserid"]);
        return {
          ...resource,
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
