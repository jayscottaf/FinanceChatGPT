import { NextResponse } from "next/server";
import { getTransaction } from "../../../../../server/transaction";

export async function POST(req) {
  try {
    const { filter } = await req.json();
    const data = await getTransaction(filter);
    console.log(JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}