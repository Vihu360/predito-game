import {
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	boolean
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "@auth/core/adapters"
import { desc, eq, sql } from "drizzle-orm"

export const users = pgTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
	isAdmin: boolean("is_admin").default(false),
	referralCode: text("referral_code"),
})

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state")
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId)
	})
)

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull()
})

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
)

export const credits = pgTable('credits', {
	id: text('id').primaryKey(),
	userId: text('userId').references(() => users.id),
	amount: integer('amount').notNull().default(30),
	lastUpdated: timestamp('last_updated').defaultNow(),
	transactionType: text('transaction_type').default('reward'), // purchase, reward, refund, etc.
	transactionId: text('transaction_id')
 });


 export const agents = pgTable(`agents`, {
 	id: text('id').primaryKey(),
 	name: text('name').notNull(),
 	email: text('email').notNull(),
 	userId: text('userId').references(() => users.id),
 })

 // Transaction related types

export const TRANSACTION_STATUS = {
	PENDING: 'pending',
	COMPLETED: 'completed',
	FAILED: 'failed',
	CANCELLED: 'cancelled'
  } as const;
  
  export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];
  
  export const TRANSACTION_TYPE = {
	WITHDRAWAL: 'withdrawal',
	RECHARGE: 'recharge',
	REWARD: 'reward',
	USAGE: 'usage',
	REFUND: 'refund'
  } as const;
  
  export type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];
  
  export const PAYMENT_METHOD = {
	BANK_TRANSFER: 'bank_transfer',
	PAYPAL: 'paypal',
	CRYPTO: 'crypto',
	CREDIT_CARD: 'credit_card',
	OTHER: 'other'
  } as const;
  
  export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];
  
  // Transactions table
  
  export const transactions = pgTable('transactions', {
	id: text('id').primaryKey(),
	userId: text('userId')
	  .notNull()
	  .references(() => users.id, { onDelete: 'cascade' }),
	type: text('type').$type<TransactionType>().notNull(),
	amount: integer('amount').notNull(),
	status: text('status').$type<TransactionStatus>().notNull().default('pending'),
	paymentMethod: text('payment_method').$type<PaymentMethod>(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	reference: text('reference'), // For payment/withdrawal reference numbers
  });

  // Helper functions for transactions

export const createTransaction = async (
	db: any, //eslint-disable-line 
	data: { 
	  id: string;
	  userId: string;
	  type: TransactionType;
	  amount: number;
	  paymentMethod?: PaymentMethod;
	  description?: string;
	  reference?: string;
	}
  ) => {
	return await db.transaction(async (tx: any) => {   //eslint-disable-line 
	  // Insert the transaction
	  const [transaction] = await tx.insert(transactions).values(data).returning();
  
	  // Update user credits based on transaction type
	  const creditChange = data.type === 'withdrawal' ? -data.amount : data.amount;
	  
	  await tx
		.update(credits)
		.set({ 
		  amount: sql`${credits.amount} + ${creditChange}`,
		  lastUpdated: new Date(),
		  transactionId: data.id,
		  transactionType: data.type
		})
		.where(eq(credits.userId, data.userId));
  
	  return transaction;
	});
  };
  
  export const getUserTransactions = async (
	db: any,  //eslint-disable-line 
	userId: string,
	limit = 10,
	offset = 0
  ) => {
	return await db
	  .select()
	  .from(transactions)
	  .where(eq(transactions.userId, userId))
	  .orderBy(desc(transactions.createdAt))
	  .limit(limit)
	  .offset(offset);
  };
  
  export const getTransactionStats = async (db: any, userId: string) => { //eslint-disable-line 
	const result = await db 
	  .select({
		totalWithdrawn: sql`sum(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END)`,
		totalRecharged: sql`sum(CASE WHEN type = 'recharge' THEN amount ELSE 0 END)`,
		totalRewards: sql`sum(CASE WHEN type = 'reward' THEN amount ELSE 0 END)`,
		totalUsage: sql`sum(CASE WHEN type = 'usage' THEN amount ELSE 0 END)`
	  })
	  .from(transactions)
	  .where(eq(transactions.userId, userId))
	  .groupBy(transactions.userId);
  
	return result[0];
  };