import { NextResponse } from "next/server";
import {
  getUserInfo,
  updateUserAccount,
  deleteUserAccount,
} from "../../../../server/user";

export async function GET(req) {
  try {
    const data = await getUserInfo();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userInfo } = await req.json();
    await updateUserAccount(userInfo);
    return NextResponse.json({
      message: "User account updated successfully",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const data = await deleteUserAccount();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}