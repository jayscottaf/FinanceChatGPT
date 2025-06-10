import { NextResponse } from "next/server";
import { getAllUsers } from "../../../../../server/user";

export async function POST(req) {
  try {
    const { filter } = await req.json();
    const data = await getAllUsers(filter);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}