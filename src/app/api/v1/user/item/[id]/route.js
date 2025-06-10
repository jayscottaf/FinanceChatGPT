import { NextResponse } from "next/server";
import { deleteItemInfoById } from "../../../../../../server/user";

export async function DELETE(req, { params }) {
  try {
    const data = await deleteItemInfoById(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}