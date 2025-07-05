import { useQuery } from "@tanstack/react-query";
import { searchFlights } from "@/lib/api";
import type { FlightSearchParams } from "@shared/schema";

export function useFlights(params: FlightSearchParams | null) {
  return useQuery({
    queryKey: ['/api/flights/search', params],
    queryFn: () => searchFlights(params!),
    enabled: !!params,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
