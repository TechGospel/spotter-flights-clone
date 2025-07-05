import { useQuery } from "@tanstack/react-query";
import { searchAirports } from "@/lib/api";
import { useState, useEffect } from "react";

export function useAirports(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['/api/airports/search', debouncedQuery],
    queryFn: async () => {
      try {
        return await searchAirports(debouncedQuery);
      } catch (error) {
        console.error('Airport search failed:', error);
        throw error;
      }
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
