import { searchHistory, userPreferences, type SearchHistory, type InsertSearchHistory, type UserPreferences, type InsertUserPreferences } from "@shared/schema";

export interface IStorage {
  // Search history
  addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getSearchHistory(limit?: number): Promise<SearchHistory[]>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private searchHistoryData: Map<number, SearchHistory>;
  private userPreferencesData: Map<string, UserPreferences>;
  private currentSearchId: number;
  private currentPrefsId: number;

  constructor() {
    this.searchHistoryData = new Map();
    this.userPreferencesData = new Map();
    this.currentSearchId = 1;
    this.currentPrefsId = 1;
  }

  async addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory> {
    const id = this.currentSearchId++;
    const searchRecord: SearchHistory = {
      ...search,
      id,
      searchedAt: new Date(),
      returnDate: search.returnDate ?? null,
      passengers: search.passengers ?? 1,
      travelClass: search.travelClass ?? "economy",
    };
    this.searchHistoryData.set(id, searchRecord);
    return searchRecord;
  }

  async getSearchHistory(limit: number = 10): Promise<SearchHistory[]> {
    const searches = Array.from(this.searchHistoryData.values())
      .sort((a, b) => b.searchedAt!.getTime() - a.searchedAt!.getTime())
      .slice(0, limit);
    return searches;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferencesData.values()).find(
      (prefs) => prefs.userId === userId
    );
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.userId);
    if (existing) {
      const updated: UserPreferences = {
        ...existing,
        preferences: preferences.preferences,
        updatedAt: new Date(),
      };
      this.userPreferencesData.set(preferences.userId, updated);
      return updated;
    } else {
      const id = this.currentPrefsId++;
      const newPrefs: UserPreferences = {
        id,
        ...preferences,
        updatedAt: new Date(),
      };
      this.userPreferencesData.set(preferences.userId, newPrefs);
      return newPrefs;
    }
  }
}

export const storage = new MemStorage();
