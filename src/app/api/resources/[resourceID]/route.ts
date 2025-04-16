import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ resourceID: string }> },
) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const resourceID = parseInt((await params).resourceID, 10);
    if (isNaN(resourceID)) {
      return NextResponse.json(
        { error: "Invalid resourceID" },
        { status: 400 },
      );
    }

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

    // Begin transaction
    await sql`BEGIN`;

    // Update the Resource table
    const updateResult = await sql`
      UPDATE Resource
      SET Title = ${title},
          Description = ${description},
          Type = ${type},
          Subject = ${subject},
          Year = ${year},
          Semester = ${semester}
      WHERE ResourceID = ${resourceID} AND UserID = ${userID}
      RETURNING *;
    `;

    if (!updateResult || updateResult.length === 0) {
      throw new Error("Resource not found or unauthorized");
    }

    const updatedResource = updateResult[0];

    // Delete existing resource files for this resource
    await sql`
      DELETE FROM ResourceFile
      WHERE ResourceID = ${resourceID};
    `;

    // Re-insert the new list of resource files
    for (const url of resourceFiles) {
      await sql`
        INSERT INTO ResourceFile (URL, ResourceID)
        VALUES (${url}, ${resourceID});
      `;
    }

    // Commit transaction
    await sql`COMMIT`;

    return NextResponse.json(updatedResource, { status: 200 });
  } catch (error) {
    console.error("Error updating resource:", error);
    try {
      await sql`ROLLBACK`;
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 },
    );
  }
}
