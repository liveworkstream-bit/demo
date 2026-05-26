import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rules = await sql`
      SELECT * FROM decline_rules 
      ORDER BY step_order ASC
    `;
    return Response.json(rules);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch decline rules" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { step_order, error_message, fixed_surcharge } = await request.json();
    const [rule] = await sql`
      INSERT INTO decline_rules (step_order, error_message, fixed_surcharge, is_active)
      VALUES (${step_order}, ${error_message}, ${fixed_surcharge}, true)
      RETURNING *
    `;
    return Response.json(rule);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create rule" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM decline_rules WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete rule" }, { status: 500 });
  }
}
