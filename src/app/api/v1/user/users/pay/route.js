import { NextResponse } from "next/server";
import { setUserPayByEmail } from "../../../../../../server/user";

export async function POST(req) {
  try {
    const reqInfo = await req.json();
    const data = await setUserPayByEmail(reqInfo);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}