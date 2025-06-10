import { NextResponse } from "next/server";
import { setAccessToken } from "../../../../../server/plaid";

export async function POST(req) {
  try {
    const reqInfo = await req.json();
    const data = await setAccessToken(reqInfo);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}