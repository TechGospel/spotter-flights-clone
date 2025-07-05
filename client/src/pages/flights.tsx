import { useEffect, useMemo, useState } from "react";
import { UserCircle, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { SearchForm } from "@/components/search-form";
import { Filters } from "@/components/filters";
import { FlightCard } from "@/components/flight-card";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlights } from "@/hooks/use-flights";
import type { FlightSearchParams } from "@shared/schema";
import type { SortOption, Flight } from "@/lib/types";

export default function Flights() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [paginationMode, setPaginationMode] = useState<"pages" | "loadMore">("loadMore");
  const { toast } = useToast();

  const memoizedParams = useMemo(() => searchParams, [searchParams]);
  const flightsQuery = useFlights(memoizedParams);

  const handleSearch = (params: FlightSearchParams) => {
    console.log("params", params);
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleFlightToggle = (flightId: string) => {
    setExpandedFlight(expandedFlight === flightId ? null : flightId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Transform API data to our Flight type
  const transformFlightData = (apiData: any): Flight[] => {
    if (!apiData?.data?.itineraries) return [];

    // Return all flights instead of slicing to 6
    return apiData.data.itineraries || [];
  };

  const flights = flightsQuery.data ? transformFlightData(flightsQuery.data) : [];
  
  // Sort flights based on selected option
  const sortedFlights = [...flights].sort((a, b) => {
    const getTotalDuration = (flight: Flight): number => {
      return flight.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
    };
  
    const durationA = getTotalDuration(a);
    const durationB = getTotalDuration(b);
  
    switch (sortBy) {
      case "cheapest":
        return a.price.raw - b.price.raw;
  
      case "quickest":
        return durationA - durationB;
  
      case "best":
      default:
        // Best is a combination of price and duration (weighted score)
        const scoreA = a.price.raw / 1000 + durationA * 0.1;
        const scoreB = b.price.raw / 1000 + durationB * 0.1;
        return scoreA - scoreB;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // For load more mode, show all flights up to current page
  const loadMoreEndIndex = paginationMode === "loadMore" 
    ? currentPage * itemsPerPage 
    : endIndex;
  
  const paginatedFlights = sortedFlights.slice(0, loadMoreEndIndex);

  const cheapestPrice = flights.length > 0 
    ? Math.min(...flights.map(f => f.price.raw))
    : undefined;

  useEffect(() => {
    if (flightsQuery.error) {
      toast({
        title: "Search Error",
        description: "Failed to search flights. Please try again.",
        variant: "destructive",
      });
    }
  }, [flightsQuery.error, toast]);

  return (
    <div className="min-h-screen google-dark text-white">
      {/* Header */}
      <header className="border-b border-gray-600 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-medium">Flights</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Search Form */}
        <SearchForm 
          onSearch={handleSearch} 
          isLoading={flightsQuery.isLoading}
        />

        {/* Results Section */}
        {searchParams && (
          <>
            {/* Filters */}
            <div className="mb-6">
              <Filters 
                sortBy={sortBy}
                onSortChange={handleSortChange}
                cheapestPrice={cheapestPrice}
              />
            </div>

            {/* Flight Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-medium mb-1">Departing flights</h2>
                  <p className="text-sm text-gray-400">
                    Prices include required taxes + fees for 1 adult. Optional charges and{" "}
                    <a href="#" className="text-blue-400 hover:underline">bag fees</a> may apply.{" "}
                    <a href="#" className="text-blue-400 hover:underline">Passenger assistance</a> info.
                  </p>
                  {/* Results count */}
                  {sortedFlights.length > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      Showing {paginatedFlights.length} of {sortedFlights.length} flights
                    </p>
                  )}
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sorted by top flights</span>
                  <ArrowUpDown className="h-4 w-4 text-blue-400" />
                </div>
              </div>

              {/* Pagination Controls */}
              {sortedFlights.length > 0 && (
                <div className="flex items-center justify-between p-4 google-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300">Show:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="w-20 h-8 border-gray-600 bg-dark">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-300">per page</span>
                  </div>
                  
                </div>
              )}

              {/* Loading State */}
              {flightsQuery.isLoading && (
                <div className="space-y-4">
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <div key={i} className="google-card rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-8 h-8 rounded" />
                          <Skeleton className="w-20 h-4" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="w-24 h-6 mb-1" />
                          <Skeleton className="w-16 h-3" />
                        </div>
                      </div>
                      <Skeleton className="w-full h-8" />
                      <div className="flex items-center justify-between mt-3">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Flight Cards */}
              {!flightsQuery.isLoading && paginatedFlights.length > 0 && (
                <>
                  <div className="space-y-4">
                    {paginatedFlights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        isExpanded={expandedFlight === flight.id}
                        onToggleExpand={() => handleFlightToggle(flight.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination or Load More */}
                  {paginationMode === "pages" && totalPages > 1 && (
                    <div className="mt-8 pt-6 border-t border-gray-600">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}

                  {paginationMode === "loadMore" && loadMoreEndIndex < sortedFlights.length && (
                    <div className="mt-8 pt-6 border-t border-gray-600 text-center">
                      <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        className="px-8 py-3 bg-dark text-white"
                      >
                        Load More Flights
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-sm text-gray-400 mt-2">
                        Showing {loadMoreEndIndex} of {sortedFlights.length} flights
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* No Results */}
              {!flightsQuery.isLoading && searchParams && flights.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No flights found for your search criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your dates or airports.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Initial State */}
        {!searchParams && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Find your perfect flight</h2>
            <p className="text-gray-400">Enter your travel details above to search for flights</p>
          </div>
        )}
      </div>
    </div>
  );
}
