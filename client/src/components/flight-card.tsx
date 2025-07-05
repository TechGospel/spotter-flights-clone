import { useState } from "react";
import { ChevronDown, Plane, Info, Armchair, Leaf, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Flight } from "@/lib/types";

interface FlightCardProps {
  flight: Flight;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function FlightCard({ flight, isExpanded = false, onToggleExpand }: FlightCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = onToggleExpand ? isExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const firstLeg = flight.legs[0];
  const lastLeg = flight.legs[flight.legs.length - 1];
  const firstSegment = firstLeg.segments[0];
  const lastSegment = lastLeg.segments[lastLeg.segments.length - 1];

  const departureTime = new Date(firstLeg.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const arrivalTime = new Date(lastLeg.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const totalDuration = flight.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
  const durationText = `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`;

  const stops = flight.legs.reduce((acc, leg) => acc + leg.stopCount, 0);


  // const emissionBadgeClass = flight.emissions.percentage < 0 
  //   ? "emission-badge-positive" 
  //   : "emission-badge-negative";

  return (
    <div className="google-card rounded-lg border hover:border-gray-400 transition-colors">
      <div className="p-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left Section: Airline Logo + Times */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Plane className="h-4 w-4 text-white" />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium text-base">{departureTime}</span>
              <span className="text-gray-400">–</span>
              <span className="font-medium text-base">{arrivalTime}</span>
              <span className="text-xs text-gray-400 ml-1 align-super">+1</span>
            </div>
          </div>

          {/* Center Section: Duration, Stops, Route */}
          <div className="flex-1 text-center">
            <div className="text-sm font-medium mb-1">{durationText}</div>
            <div className="text-sm text-gray-400">
            {firstLeg.origin.displayCode} → {lastLeg.destination.displayCode}
            </div>
          </div>

          {/* Right Center: Stops Info */}
          <div className="flex-1 text-center">
            <div className="text-sm font-medium mb-1">
            {stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`}
            </div>
          </div>

          {/* Far Right: Emissions */}
          <div className="text-center">
            {/* <div className="text-sm font-medium mb-1">{flight.emissions.co2} kg CO2e</div>
            <div className="flex items-center space-x-1">
              <Badge className={cn("text-xs px-2 py-1", emissionBadgeClass)}>
                {flight.emissions.percentage}% emissions
              </Badge>
              <Info className="h-3 w-3 text-gray-400" />
            </div> */}
          </div>

          {/* Price and Expand Button */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-green-400">
              {flight.price.formatted}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="rounded-full hover:bg-gray-700"
            >
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform",
                  expanded && "rotate-180"
                )} 
              />
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Top Row: Airline + Times + Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-lg">{departureTime}</span>
                <span className="text-gray-400">⟷</span>
                <span className="font-medium text-lg">{arrivalTime}</span>
                <span className="text-xs text-gray-400 align-super">+1</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-green-400">
              {flight.price.formatted}
              </div>
            </div>
          </div>

          {/* Second Row: Route */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {firstLeg.origin.displayCode} → {lastLeg.destination.displayCode}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="rounded-full hover:bg-gray-700"
            >
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform",
                  expanded && "rotate-180"
                )} 
              />
            </Button>
          </div>

          {/* Third Row: Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm">
              {stops === 0 ? "Nonstop" : `${stops} stop${stops > 1 ? "s" : ""}`}
              </span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm">{durationText}</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* <Badge className={cn("text-xs px-2 py-1", emissionBadgeClass)}>
                {flight.emissions.percentage}% emissions
              </Badge>
              <Info className="h-3 w-3 text-gray-400" /> */}
            </div>
          </div>
        </div>
      </div>

      {/* <Collapsible open={expanded} onOpenChange={handleToggle}>
        <CollapsibleContent className="border-t border-gray-600 p-4 bg-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="font-medium">{flight.departure.time}</span>
                </div>
                <div className="text-sm text-gray-300 ml-4">
                ({flight.departure.airportName}) ({flight.departure.airport})
                </div>
                <div className="text-sm text-gray-400 ml-4">
                  Travel time: {flight.duration}
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm font-medium">
                Select flight
              </Button>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="font-medium">{flight.arrival.time}</span>
            </div>
            <div className="text-sm text-gray-300 ml-8">
            ({flight.arrival.airportName}) ({flight.arrival.airport})
            </div>

            <div className="text-sm text-gray-400 ml-4">
              {flight.airline} {flight.flightNumber} · Economy · {flight.aircraft}
            </div>

            <div className="space-y-2 ml-4">
              {flight.legroom && (
                <div className="flex items-center space-x-2">
                  <Armchair className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Average legroom ({flight.legroom})</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Leaf className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Emissions estimate: {flight.emissions.co2} kg CO2e</span>
              </div>
              {flight.contrailPotential && (
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Contrail warming potential: {flight.contrailPotential}</span>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Badge className={cn("text-xs", emissionBadgeClass)}>
                {flight.emissions.percentage > 0 ? '+' : ''}{flight.emissions.percentage}% emissions
              </Badge>
              <Info className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible> */}
      <Collapsible open={expanded} onOpenChange={handleToggle}>
        <CollapsibleContent className="border-t border-gray-600 p-4 bg-gray-700 space-y-6">
          {flight.legs.map((leg, index) => {
            const legDepartureTime = new Date(leg.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const legArrivalTime = new Date(leg.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const segment = leg.segments[0]; // assuming only 1 segment for simplicity
            return (
              <div key={leg.id} className="space-y-2 border-b border-gray-500 pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Leg {index + 1}</div>
                  <div className="text-sm text-gray-300 font-medium">
                    {leg.origin.displayCode} → {leg.destination.displayCode}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{legDepartureTime}</span>
                      <span className="text-sm text-white font-medium">({leg.origin.name} {leg.origin.displayCode})</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Travel Time: {Math.floor(leg.durationInMinutes / 60)}h {leg.durationInMinutes % 60}m
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{legArrivalTime}</span>
                      <span className="text-sm text-white font-medium">({leg.destination.name} {leg.destination.displayCode})</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    {/* Todo: Add other flight details */}
                  </div>
                </div>

                <div className="text-sm text-gray-300">
                  Flight: {segment.flightNumber} · {segment.marketingCarrier.name}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm font-medium">
              Select flight
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );
}
