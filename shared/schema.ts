import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  originEntityId: text("origin_entity_id").notNull(),
  destinationEntityId: text("destination_entity_id").notNull(),
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date"),
  passengers: integer("passengers").notNull().default(1),
  travelClass: text("travel_class").notNull().default("economy"),
  searchedAt: timestamp("searched_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  preferences: jsonb("preferences").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  searchedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updatedAt: true,
});

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Flight search schemas
export const flightSearchSchema = z.object({
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  originEntityId: z.string().min(3, "Destination is required"),
  destinationEntityId: z.string().min(3, "Destination is required"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9).default(1),
  travelClass: z.enum(["economy", "premium_economy", "business", "first"]).default("economy"),
  tripType: z.enum(["round_trip", "one_way", "multi_city"]).default("round_trip"),
});

export const airportSearchSchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters"),
});

export type FlightSearchParams = z.infer<typeof flightSearchSchema>;
export type AirportSearchParams = z.infer<typeof airportSearchSchema>;
