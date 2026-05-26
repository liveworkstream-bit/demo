import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const accounts = await sql`
      SELECT * FROM accounts 
      WHERE is_sold = false 
      ORDER BY created_at DESC
    `;
    return Response.json(accounts);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch accounts" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      username,
      region,
      region_code,
      price,
      followers,
      following,
      likes,
      videos,
      niche,
      age,
      profile_image,
    } = body;

    const [account] = await sql`
      INSERT INTO accounts (username, region, region_code, price, followers, following, likes, videos, niche, age, profile_image)
      VALUES (${username}, ${region}, ${region_code}, ${price}, ${followers || 0}, ${following || 0}, ${likes || 0}, ${videos || 0}, ${niche || ""}, ${age || ""}, ${profile_image || ""})
      RETURNING *
    `;

    return Response.json(account);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await sql`DELETE FROM accounts WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
