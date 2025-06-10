import { NextResponse } from "next/server";
import {
  clearChatHistory
} from "../../../../../server/chat";

export async function DELETE(req) {
  try {
    const data = await clearChatHistory();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}