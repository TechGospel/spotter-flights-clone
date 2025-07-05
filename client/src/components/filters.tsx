import { useState } from "react";
import { Filter, ChevronDown, TrendingUp, Calendar, BarChart3, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { SortOption } from "@/lib/types";

interface FiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  cheapestPrice?: number;
}

export function Filters({ sortBy, onSortChange, cheapestPrice }: FiltersProps) {
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [anyDatesEnabled, setAnyDatesEnabled] = useState(false);

  const filters = [
    { label: "All filters", icon: Filter },
    { label: "Stops", hasDropdown: true },
    { label: "Airlines", hasDropdown: true },
    { label: "Bags", hasDropdown: true },
    { label: "Price", hasDropdown: true },
    { label: "Times", hasDropdown: true },
    { label: "Emissions", hasDropdown: true },
    { label: "Connecting airports", hasDropdown: true },
    { label: "Duration", hasDropdown: true },
  ];

  return (
    <div className="space-y-4">
      

      {/* Sort Tabs */}
      <Tabs value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)} className="w-full">
        <TabsList className="grid w-full h-fit grid-cols-1 lg:w-auto lg:grid-cols-3 bg-transparent p-0 space-x-1 space-y-2">
          <TabsTrigger
            value="best"
            className="data-[state=active]:bg-blue-600 data-[state=inactive]:google-card data-[state=inactive]:hover:bg-gray-600 px-8 py-3 rounded-lg"
          >
            Best
            <Info className="h-3 w-3 ml-2" />
          </TabsTrigger>
          <TabsTrigger
            value="cheapest"
            className="data-[state=active]:bg-blue-600 data-[state=inactive]:google-card data-[state=inactive]:hover:bg-gray-600 px-8 py-3 rounded-lg"
          >
            Cheapest{" "}
            {cheapestPrice && (
              <span className="text-gray-400 ml-1">
                from NGN {cheapestPrice.toLocaleString()}
              </span>
            )}
            <Info className="h-3 w-3 ml-2" />
          </TabsTrigger>
          <TabsTrigger
            value="quickest"
            className="data-[state=active]:bg-blue-600 data-[state=inactive]:google-card data-[state=inactive]:hover:bg-gray-600 px-8 py-3 rounded-lg"
          >
            Quickest
          </TabsTrigger>
        </TabsList>
      </Tabs>

    </div>
  );
}
