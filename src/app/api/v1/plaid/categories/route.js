import { NextResponse } from "next/server";
import { getAllCategories } from "../../../../../server/plaid";

export async function GET(req) {
  try {
    const data = await getAllCategories();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}