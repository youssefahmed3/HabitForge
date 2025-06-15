
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";


/* AUTH SECHEMAS BY BETTER-AUTH */
export const userTable = sqliteTable("user", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).$defaultFn(() => false).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const sessionTable = sqliteTable("session", {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' })
});

export const accountTable = sqliteTable("account", {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verificationTable = sqliteTable("verification", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date())
});

/* SCHEMAS FOR THE API */

/* 
	Description for Habit Category
		a category can have multiple habits
		a category can be global or specific to a user
		a category can have a name and a description
		a category can have a creation date and a last update date
		a category can have a null habits in the start to provide more flexibility for the ux 
*/

export const habitCategoriesTable = sqliteTable("habit_categories", {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, table => {
	return {
		// Unique index: combination of user_id and name
		// to make sure that i have a global categories for all users 
		// to make sure also that i can add a category for a specific user
		// to make sure that the user can not add a duplicated category that is global or a duplicated category for the same user
		uniqueUserCategory: uniqueIndex('unique_user_category').on(table.userId, table.name),
	}
})


/* 
	Description for Habit
		a habit can have a name and a description
		a habit can have a creation date and a last update date
		a habit is linked to a specific user and can be linked to a category
	NOTES: 
		in habits table i have a nullable categoryId to provide more flexibility for the ux to make sure that the user can add a habit without a category and the habit can later be assigned to a category 
		so basically there is a hidden category named uncategorized 
*/

export const habitsTable = sqliteTable("habits", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	categoryId: text('category_id').references(() => habitCategoriesTable.id, { onDelete: 'set null' }),
	userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, table => {
	return {
		// unique name for each user cannot add dupleicated habits
		uniqueHabitNamePerUser: uniqueIndex('unique_habit_name_per_user').on(table.name, table.userId),
	}
});

/* 
	Description for Habit Entry
		a habit entry is linked to a specific habit and a specific date
		a habit entry can have a completed status
*/

export const habitEntriesTable = sqliteTable("habit_entries", {
	id: text('id').primaryKey(),
	habitId: text('habit_id').notNull().references(() => habitsTable.id, { onDelete: 'cascade' }),
	completed: integer('completed', { mode: 'boolean' }).$defaultFn(() => false).notNull(),
	date: text('date').default(sql`CURRENT_TIMESTAMP`)
});