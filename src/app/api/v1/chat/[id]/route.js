import { NextResponse } from "next/server";
import {
  getChatInfoById,
  deleteChatChannel,
} from "../../../../../server/chat";

export async function GET(req, { params }) {
  try {
    const data = await getChatInfoById(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const data = await deleteChatChannel(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}