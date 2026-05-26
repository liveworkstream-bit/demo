import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const {
      agent_id,
      item_type,
      item_id,
      base_price,
      current_attempt,
      card_details,
      tax_paid,
    } = await request.json();

    // 1. Check for active decline rule for this attempt
    const [rule] = await sql`
      SELECT * FROM decline_rules 
      WHERE step_order = ${current_attempt} 
      AND is_active = true
    `;

    if (rule) {
      return Response.json({
        success: false,
        error_msg: rule.error_message,
        surcharge: parseFloat(rule.fixed_surcharge),
        next_attempt: current_attempt + 1,
      });
    }

    // 2. No rule found — process as success
    const totalSurcharges = parseFloat(tax_paid || 0);
    const total_paid = parseFloat(base_price) + totalSurcharges;

    const [order] = await sql`
      INSERT INTO orders (agent_id, item_type, item_id, base_price, tax_paid, total_paid, status)
      VALUES (${agent_id || null}, ${item_type}, ${item_id || null}, ${base_price}, ${totalSurcharges}, ${total_paid}, 'completed')
      RETURNING *
    `;

    // Mark account as sold if this is an account purchase
    if (item_type === "account" && item_id) {
      await sql`UPDATE accounts SET is_sold = true WHERE id = ${item_id}`;
    }

    return Response.json({
      success: true,
      order: order,
      message: "Payment processed successfully!",
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Payment processing failed" },
      { status: 500 },
    );
  }
}
