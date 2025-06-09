import { type Message } from "ai";

export interface Chat extends Record<string, any> {
    id: string;
    title: string;
    createdAt: Date;
    userId: string;
    path: string;
    messages: Message[];
}

export type ServerActionResult<Result> = Promise<
    | Result
    | {
          error: string;
      }
>;

export type UserSession = {
    id: string;
    name: string;
    email: string;
    image: string;
    isNewUser: boolean;
    isAdmin: boolean;
};

export interface ExtendedSession {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    isAdmin?: boolean;
}

export type User = {
    id: string;
    name: string;
    email: string; // Unique field
    phone?: string;
    family_name?: string;
    given_name?: string;
    image?: string;
    locale: string; // Default: "en"
    country?: string;
    state?: string;
    city?: string;
    salary?: number;
    payday?: number;
    twilioToken?: string;
    ACCESS_TOKEN?: string;
    ITEM_ID?: string;
    TRANSFER_ID?: string;
    storeAYear: boolean; // Default: true
    kpis: any[]; // Json is typically represented as any[]
    kpis_prev: any[]; // Json is typically represented as any[]
    isPro: boolean; // Default: false
    subscription?: string;
    createdAt: Date; // CreatedAt: DateTime equivalent
    transactions: Transaction[];
    items: Item[];
    chats: Chat[];
}
  
export type Transaction = {
    id: string;
    userId: string;
    user: User;
    name?: string;
    amount: number;
    account_id: string;
    date: Date;
    iso_currency_code?: string;
    unofficial_currency_code?: string;
    category: string[];
    payment_channel?: string;
    category_id?: string;
    check_number?: string;
    datetime?: Date;
    authorized_date?: Date;
    authorized_datetime?: Date;
    location?: Location;
    merchant_name?: string;
    payment_meta?: PaymentMeta;
    pending?: boolean;
    pending_transaction_id?: string;
    personal_finance_category?: PersonalFinanceCategory;
    transaction_id?: string;
    transaction_code?: string;
    transaction_type?: string;
    cancel_transaction_id?: string;
    fees?: number;
    investment_transaction_id?: string;
    price?: number;
    quantity?: number;
    security_id?: string;
    subtype?: string;
    type?: string;
}
  
export type Item = {
    id: string;
    userId: string;
    user: User;
    institutionId: string;
    institution?: Institution;
    accounts: Account[];
    cursor?: string;
    ACCESS_TOKEN?: string;
    ITEM_ID?: string;
    TRANSFER_ID?: string;
    endDate?: string;
    products: string[];
}
  
export type Location = {
    id: string;
    address?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
    lat?: number;
    lon?: number;
    store_number?: string;
    transactionId: string; // Unique field
    transaction: Transaction; // Assuming Transaction is another type/interface
}

export type PaymentMeta = {
    id: string;
    by_order_of?: string;
    payee?: string;
    payer?: string;
    payment_method?: string;
    payment_processor?: string;
    ppd_id?: string;
    reason?: string;
    reference_number?: string;
    transactionId: string; // Unique field
    transaction: Transaction; // Assuming Transaction is another type/interface
}

export type PersonalFinanceCategory = {
    id: string;
    primary?: string;
    detailed?: string;
    transactionId: string; // Unique field
    transaction: Transaction; // Assuming Transaction is another type/interface
}

export type Institution = {
    id: string;
    institution_id?: string;
    name?: string;
    itemId?: string;
    items: Item[]; // Assuming Item is another type/interface
}

export type Account = {
    id: string;
    itemId: string;
    item: Item; // Assuming Item is another type/interface
    account_id: string; // Unique field
    balances?: Balances; // Assuming Balances is another type/interface
    mask?: string;
    name?: string;
    official_name?: string;
    subtype?: string;
    type?: string;
    persistent_account_id?: string;
}

export type Balances = {
    id: string;
    available?: number;
    current?: number;
    iso_currency_code?: string;
    limit?: number;
    unofficial_currency_code?: string;
    accountId: string; // Unique field
    account?: Account; // Assuming Account is another type/interface
}
