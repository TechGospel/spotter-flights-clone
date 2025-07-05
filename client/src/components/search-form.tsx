import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ArrowUpDown, MapPin, Users, Plane } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { flightSearchSchema, type FlightSearchParams } from "@shared/schema";
import { useAirports } from "@/hooks/use-airports";

interface SearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);

  const originAirports = useAirports(originQuery);
  const destinationAirports = useAirports(destinationQuery);

  // Debug logging
  if (originAirports.data && originQuery.length >= 2) {
    console.log('Origin airports data:', originAirports.data);
    console.log('Origin airports data.data:', originAirports.data.data);
    console.log('Query length:', originQuery.length);
    console.log('Loading state:', originAirports.isLoading);
    console.log('Error state:', originAirports.isError);
  }

  const form = useForm<FlightSearchParams>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      travelClass: "economy",
      tripType: "round_trip",
    },
  });

  const tripType = form.watch("tripType");

  const onSubmit = (data: FlightSearchParams) => {
    console.log("data", data);
    onSearch(data);
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  const swapLocations = () => {
    const origin = form.getValues("origin");
    const destination = form.getValues("destination");
    form.setValue("origin", destination);
    form.setValue("destination", origin);
    setOriginQuery("");
    setDestinationQuery("");
  };

  return (
    <div className="google-card rounded-lg p-6 mb-6 border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Trip Type and Passenger Selection */}
          <div className="flex flex-wrap gap-4">
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-blue-400" />
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-none bg-transparent focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="round_trip">Round trip</SelectItem>
                      <SelectItem value="one_way">One way</SelectItem>
                      <SelectItem value="multi_city">Multi-city</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="border-none bg-transparent focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelClass"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-none bg-transparent focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">
                        Premium economy
                      </SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Location and Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origin */}
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="border border-gray-600 rounded-lg p-3 focus-within:border-blue-400 transition-colors">
                    <FormLabel className="block text-xs text-gray-400 mb-1">
                      From
                    </FormLabel>
                    <Popover open={originOpen} onOpenChange={setOriginOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="ghost"
                            role="combobox"
                            className="w-full justify-start h-auto p-0 font-normal"
                          >
                            <div className="w-2 h-2 rounded-full bg-gray-400 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {field.value || "Select airport"}
                            </span>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search airports..."
                            value={originQuery}
                            onValueChange={setOriginQuery}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {originAirports.isLoading 
                                ? "Searching airports..."
                                : originAirports.isError
                                ? "Error loading airports. Please try again."
                                : originQuery.length < 2
                                ? "Type at least 2 characters"
                                : "No airports found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {originAirports.data?.data?.map(
                                (airport: any) => (
                                  <CommandItem
                                    key={airport.skyId}
                                    value={`${airport.presentation.suggestionTitle} ${airport.presentation.subtitle} ${airport.skyId}`}
                                    onSelect={() => {
                                      form.setValue("origin", airport.skyId);
                                      form.setValue("originEntityId", airport.entityId);
                                      setOriginOpen(false);
                                      setOriginQuery("");
                                    }}
                                  >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <div>
                                      <div className="font-medium">
                                        {airport.presentation.suggestionTitle}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {airport.presentation.subtitle}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ),
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />

            {/* Swap Button */}
            <div className="hidden lg:flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={swapLocations}
                className="rounded-full hover:bg-gray-700"
              >
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              </Button>
            </div>

            {/* Destination */}
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="border border-gray-600 rounded-lg p-3 focus-within:border-blue-400 transition-colors">
                    <FormLabel className="block text-xs text-gray-400 mb-1">
                      To
                    </FormLabel>
                    <Popover
                      open={destinationOpen}
                      onOpenChange={setDestinationOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="ghost"
                            role="combobox"
                            className="w-full justify-start h-auto p-0 font-normal"
                          >
                            <MapPin className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {field.value || "Select airport"}
                            </span>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search airports..."
                            value={destinationQuery}
                            onValueChange={setDestinationQuery}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {destinationAirports.isLoading 
                                ? "Searching airports..."
                                : destinationAirports.isError
                                ? "Error loading airports. Please try again."
                                : destinationQuery.length < 2
                                ? "Type at least 2 characters"
                                : "No airports found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {destinationAirports.data?.data?.map(
                                (airport: any) => (
                                  <CommandItem
                                    key={airport.skyId}
                                    value={`${airport.presentation.suggestionTitle} ${airport.presentation.subtitle} ${airport.skyId}`}
                                    onSelect={() => {
                                      form.setValue(
                                        "destination",
                                        airport.skyId,
                                      );
                                      form.setValue(
                                        "destinationEntityId",
                                        airport.entityId,
                                      );
                                      setDestinationOpen(false);
                                      setDestinationQuery("");
                                    }}
                                  >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <div>
                                      <div className="font-medium">
                                        {airport.presentation.suggestionTitle}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {airport.presentation.subtitle}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ),
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormItem>
              )}
            />

            {/* Date Range */}
            <div className="lg:col-span-1">
              <div className="border border-gray-600 rounded-lg p-3 focus-within:border-blue-400 transition-colors">
                <FormLabel className="block text-xs text-gray-400 mb-1">
                  {tripType === "round_trip" ? "Depart - Return" : "Departure"}
                </FormLabel>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "h-auto p-0 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? format(new Date(field.value), "MMM dd")
                                    : "Departure"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : "",
                                  )
                                }
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    {tripType === "round_trip" && (
                      <>
                        <span className="text-gray-400">-</span>
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="ghost"
                                      className={cn(
                                        "h-auto p-0 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value
                                        ? format(
                                            new Date(field.value),
                                            "MMM dd",
                                          )
                                        : "Return"}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) =>
                                      field.onChange(
                                        date ? format(date, "yyyy-MM-dd") : "",
                                      )
                                    }
                                    disabled={(date) => {
                                      const departureDate =
                                        form.getValues("departureDate");
                                      if (date < new Date()) {
                                        return true;
                                      }
                                      if (departureDate) {
                                        return date <= new Date(departureDate);
                                      }
                                      return false;
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
