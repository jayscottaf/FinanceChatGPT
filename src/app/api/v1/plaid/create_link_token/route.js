import { NextResponse } from "next/server";
import { createLinkToken } from "../../../../../server/plaid";

export async function GET(req) {
  try {
    const data = await createLinkToken();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}