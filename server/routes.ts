import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flightSearchSchema, airportSearchSchema, insertSearchHistorySchema } from "@shared/schema";
import data from "../data.ts";

export async function registerRoutes(app: Express): Promise<Server> {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.X_RAPIDAPI_KEY;
  const RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com";

  console.log("RAPIDAPI_KEY", RAPIDAPI_KEY);

  // Airport search endpoint
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { query } = airportSearchSchema.parse(req.query);
      console.log(`Searching airports for query: "${query}"`);
      
      // Try different Sky Scrapper API endpoints
      const endpoints = [
        `/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}`,
        `/api/v2/flights/searchAirport?query=${encodeURIComponent(query)}`,
      ];

      let lastError;
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(`https://${RAPIDAPI_HOST}${endpoint}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-key': RAPIDAPI_KEY || '',
              'x-rapidapi-host': RAPIDAPI_HOST,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });

          console.log(`Response status: ${response.status} for endpoint: ${endpoint}`);
          
          if (response.ok || response.status === 304) {
            try {
              const data = await response.json();
              console.log(`Airport search successful with status ${response.status}:`, JSON.stringify(data).substring(0, 100));
              res.json(data);
              return;
            } catch (jsonError) {
              console.log(`JSON parse error for status ${response.status}:`, jsonError);
              // For 304, response might be empty, continue to next endpoint
              if (response.status === 304) {
                lastError = new Error(`304 response with empty body`);
                continue;
              }
              throw jsonError;
            }
          }
          
          console.log(`Failed endpoint ${endpoint} with status ${response.status}`);
          lastError = new Error(`API request failed: ${response.status}`);
        } catch (err) {
          if (err instanceof Error) {
            console.log(`Exception for endpoint ${endpoint}:`, err.message);
          } else {
            console.log(`Exception for endpoint ${endpoint}:`, err);
          }
          lastError = err;
          continue;
        }
      }

      // If all API calls failed, fall through to mock data
      console.log('All API endpoints failed, using mock data');
      
      // Return comprehensive mock data for development
      const allAirports = [
        { skyId: "LOS", entityId: "95673655", presentation: { suggestionTitle: "Murtala Muhammed Airport, Lagos", subtitle: "LOS · Nigeria" }},
        { skyId: "ABV", entityId: "95673644", presentation: { suggestionTitle: "Nnamdi Azikiwe International Airport, Abuja", subtitle: "ABV · Nigeria" }},
        { skyId: "PHC", entityId: "95673649", presentation: { suggestionTitle: "Port Harcourt International Airport, Port Harcourt", subtitle: "PHC · Nigeria" }},
        { skyId: "KAN", entityId: "95673650", presentation: { suggestionTitle: "Mallam Aminu Kano International Airport, Kano", subtitle: "KAN · Nigeria" }},
        { skyId: "IBA", entityId: "95673651", presentation: { suggestionTitle: "Ibadan Airport, Ibadan", subtitle: "IBA · Nigeria" }},
        { skyId: "ENU", entityId: "95673652", presentation: { suggestionTitle: "Akanu Ibiam International Airport, Enugu", subtitle: "ENU · Nigeria" }},
        { skyId: "BEN", entityId: "95673653", presentation: { suggestionTitle: "Benin Airport, Benin City", subtitle: "BEN · Nigeria" }},
        { skyId: "CBQ", entityId: "95673654", presentation: { suggestionTitle: "Margaret Ekpo International Airport, Calabar", subtitle: "CBQ · Nigeria" }},
        { skyId: "LHR", entityId: "27544008", presentation: { suggestionTitle: "Heathrow Airport, London", subtitle: "LHR · United Kingdom" }},
        { skyId: "JFK", entityId: "27537542", presentation: { suggestionTitle: "John F. Kennedy International Airport, New York", subtitle: "JFK · United States" }},
        { skyId: "DXB", entityId: "95565050", presentation: { suggestionTitle: "Dubai International Airport, Dubai", subtitle: "DXB · United Arab Emirates" }},
        { skyId: "CDG", entityId: "95565062", presentation: { suggestionTitle: "Charles de Gaulle Airport, Paris", subtitle: "CDG · France" }},
        { skyId: "FRA", entityId: "95565073", presentation: { suggestionTitle: "Frankfurt Airport, Frankfurt", subtitle: "FRA · Germany" }},
        { skyId: "AMS", entityId: "95565041", presentation: { suggestionTitle: "Amsterdam Airport Schiphol, Amsterdam", subtitle: "AMS · Netherlands" }},
        { skyId: "IST", entityId: "95565101", presentation: { suggestionTitle: "Istanbul Airport, Istanbul", subtitle: "IST · Turkey" }},
        { skyId: "DOH", entityId: "95565065", presentation: { suggestionTitle: "Hamad International Airport, Doha", subtitle: "DOH · Qatar" }},
        { skyId: "JNB", entityId: "95565104", presentation: { suggestionTitle: "O. R. Tambo International Airport, Johannesburg", subtitle: "JNB · South Africa" }},
        { skyId: "CAI", entityId: "95565057", presentation: { suggestionTitle: "Cairo International Airport, Cairo", subtitle: "CAI · Egypt" }},
        { skyId: "ADD", entityId: "95565040", presentation: { suggestionTitle: "Addis Ababa Bole International Airport, Addis Ababa", subtitle: "ADD · Ethiopia" }},
        { skyId: "ACC", entityId: "95565039", presentation: { suggestionTitle: "Kotoka International Airport, Accra", subtitle: "ACC · Ghana" }}
      ];
      

      const mockAirports = {
        status: true,
        data: allAirports.filter(airport => 
          airport.presentation.suggestionTitle.toLowerCase().includes(query.toLowerCase()) ||
          airport.presentation.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          airport.skyId.toLowerCase().includes(query.toLowerCase())
        )
      };

      res.json(mockAirports);
    } catch (error) {
      console.error('Airport search error:', error);
      res.status(500).json({ 
        error: "Failed to search airports", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Flight search endpoint
  app.post("/api/flights/search", async (req, res) => {
    let searchParams;
    
    try {
      searchParams = flightSearchSchema.parse(req.body);
      
      // Save search to history
      await storage.addSearchHistory(searchParams);

      // Try different Sky Scrapper API endpoints for flight search
      const endpoints = [
        `/api/v1/flights/searchFlights`,
        `/api/v2/flights/searchFlights`,
      ];

      const apiParams = new URLSearchParams({
        originSkyId: searchParams.origin,
        destinationSkyId: searchParams.destination,
        originEntityId: searchParams.originEntityId,
        destinationEntityId: searchParams.destinationEntityId,
        date: searchParams.departureDate,
        adults: searchParams.passengers.toString(),
        cabinClass: searchParams.travelClass,
        currency: 'USD',
        market: 'US',
        locale: 'en-US'
      });

      console.log(apiParams.toString());

      if (searchParams.returnDate && searchParams.tripType === 'round_trip') {
        apiParams.append('returnDate', searchParams.returnDate);
      }

      let lastError;
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(`https://${RAPIDAPI_HOST}${endpoint}?${apiParams.toString()}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-key': RAPIDAPI_KEY || '',
              'x-rapidapi-host': RAPIDAPI_HOST,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              "Accept": "application/json"
            }
          });

          if (response.ok || response.status === 304) {
            try {
              const data = await response.json();
              console.log(`Flight search successful with status ${response.status}:`, JSON.stringify(data).substring(0, 100));
              res.json(data);
              return;
            } catch (jsonError) {
              console.log(`JSON parse error for status ${response.status}:`, jsonError);
              // For 304, response might be empty, continue to next endpoint
              if (response.status === 304) {
                lastError = new Error(`304 response with empty body`);
                continue;
              }
              throw jsonError;
            }
          }
          
          lastError = new Error(`Flight search failed: ${response.status}`);
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      throw lastError || new Error('All flight search endpoints failed');
    } catch (error) {
      console.error('Flight search error:', error);

      const mockApiData = {
        status: true,
        data: data
      };

      res.json(mockApiData);
    }
  });

  // Get search history
  app.get("/api/search-history", async (req, res) => {
    try {
      const history = await storage.getSearchHistory(10);
      res.json(history);
    } catch (error) {
      console.error('Search history error:', error);
      res.status(500).json({ error: "Failed to get search history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
