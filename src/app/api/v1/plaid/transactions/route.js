import { NextResponse } from "next/server";
import { transactions } from "../../../../../server/plaid";

export async function GET(req) {
  try {
    const data = await transactions();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}