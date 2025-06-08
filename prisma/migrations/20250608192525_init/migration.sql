-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "family_name" TEXT,
    "given_name" TEXT,
    "image" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "salary" DOUBLE PRECISION,
    "payday" INTEGER,
    "twilioToken" TEXT,
    "ACCESS_TOKEN" TEXT,
    "ITEM_ID" TEXT,
    "TRANSFER_ID" TEXT,
    "storeAYear" BOOLEAN NOT NULL DEFAULT true,
    "kpis" JSONB[],
    "kpis_prev" JSONB[],
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "subscription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "account_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "iso_currency_code" TEXT,
    "unofficial_currency_code" TEXT,
    "category" TEXT[],
    "payment_channel" TEXT,
    "category_id" TEXT,
    "check_number" TEXT,
    "datetime" TIMESTAMP(3),
    "authorized_date" TIMESTAMP(3),
    "authorized_datetime" TIMESTAMP(3),
    "merchant_name" TEXT,
    "pending" BOOLEAN,
    "pending_transaction_id" TEXT,
    "transaction_id" TEXT,
    "transaction_code" TEXT,
    "transaction_type" TEXT,
    "cancel_transaction_id" TEXT,
    "fees" DOUBLE PRECISION,
    "investment_transaction_id" TEXT,
    "price" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION,
    "security_id" TEXT,
    "subtype" TEXT,
    "type" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "cursor" TEXT,
    "ACCESS_TOKEN" TEXT,
    "ITEM_ID" TEXT,
    "TRANSFER_ID" TEXT,
    "endDate" TEXT,
    "products" TEXT[],

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "messages" TEXT,
    "path" TEXT,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "hierarchy" TEXT[],

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "region" TEXT,
    "postal_code" TEXT,
    "country" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "store_number" TEXT,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMeta" (
    "id" TEXT NOT NULL,
    "by_order_of" TEXT,
    "payee" TEXT,
    "payer" TEXT,
    "payment_method" TEXT,
    "payment_processor" TEXT,
    "ppd_id" TEXT,
    "reason" TEXT,
    "reference_number" TEXT,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "PaymentMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalFinanceCategory" (
    "id" TEXT NOT NULL,
    "primary" TEXT,
    "detailed" TEXT,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "PersonalFinanceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT,
    "name" TEXT,
    "itemId" TEXT,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "mask" TEXT,
    "name" TEXT,
    "official_name" TEXT,
    "subtype" TEXT,
    "type" TEXT,
    "persistent_account_id" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balances" (
    "id" TEXT NOT NULL,
    "available" DOUBLE PRECISION,
    "current" DOUBLE PRECISION,
    "last_updated_datetime" TIMESTAMP(3),
    "iso_currency_code" TEXT,
    "limit" DOUBLE PRECISION,
    "unofficial_currency_code" TEXT,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Location_transactionId_key" ON "Location"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMeta_transactionId_key" ON "PaymentMeta"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalFinanceCategory_transactionId_key" ON "PersonalFinanceCategory"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_id_key" ON "Account"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Balances_accountId_key" ON "Balances"("accountId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMeta" ADD CONSTRAINT "PaymentMeta_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalFinanceCategory" ADD CONSTRAINT "PersonalFinanceCategory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balances" ADD CONSTRAINT "Balances_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
