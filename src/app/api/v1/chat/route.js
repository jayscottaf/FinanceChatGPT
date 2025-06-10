import { NextResponse } from "next/server";
import { getChatInfo } from "../../../../server/chat";

export async function GET(req) {
  try {
    const data = await getChatInfo();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}