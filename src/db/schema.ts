import { integer, text, boolean, pgTable, timestamp, primaryKey, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});

