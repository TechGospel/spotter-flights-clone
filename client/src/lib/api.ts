import { apiRequest } from "./queryClient";
import type { FlightSearchParams, AirportSearchParams } from "@shared/schema";

export async function searchAirports(query: string) {
  const response = await apiRequest(
    "GET",
    `/api/airports/search?query=${encodeURIComponent(query)}`,
  );
  return response.json();
}

export async function searchFlights(params: FlightSearchParams) {
  const response = await apiRequest(
    "POST",
    "/api/flights/search",
    params,
  );
  return response.json();
}

export async function getSearchHistory() {
  const response = await apiRequest(
    "GET",
    "/api/search-history",
  );
  return response.json();
}
