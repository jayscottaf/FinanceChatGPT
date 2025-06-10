import { NextResponse } from "next/server";
import { transactionsSyncAll } from '@/app/actions/plaidService';
import db from '@/lib/db';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params; // Extract userId from dynamic route

    // Validate API Key from Headers
    const apiKey = req.headers.get('x-api-key');
    const VALID_API_KEY = process.env.PUBLIC_API_KEY; // This is the API key you defined in the .env file
    if (apiKey !== VALID_API_KEY) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!userId) {
        return NextResponse.json({ message: "Missing userId in request." }, { status: 400 });
    }

    try {
        // First sync the transactions
        await transactionsSyncAll(userId);
        
        // Now fetch all transactions for the user from the database
        const transactions = await db.transaction.findMany({
            where: {
                userId: userId
            },
            include: {
                personal_finance_category: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json({ message: "Authorized", data: transactions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ message: "Failed to fetch transactions." }, { status: 500 });
    }
}
