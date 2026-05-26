import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const regions = await sql`SELECT * FROM regions ORDER BY name ASC`;
    return Response.json(regions);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch regions" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, code, flag, conversion_fee } = await request.json();
    const [region] = await sql`
      INSERT INTO regions (name, code, flag, conversion_fee, is_active)
      VALUES (${name}, ${code}, ${flag || ""}, ${conversion_fee || 4.99}, true)
      RETURNING *
    `;
    return Response.json(region);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create region" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM regions WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete region" }, { status: 500 });
  }
}
