import { NextResponse } from "next/server";
import { getDashboard } from "../../../../../server/user";

export async function GET(req) {
  try {
    const data = await getDashboard();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}