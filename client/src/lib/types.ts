export interface Airport {
  id: string;
  name: string;
  iata: string;
  city: string;
  country: string;
}

// export interface Flight {
//   id: string;
//   airline: string;
//   flightNumber: string;
//   aircraft: string;
//   departure: {
//     time: string;
//     airport: string;
//     airportName:string;
//     date: string;
//   };
//   arrival: {
//     time: string;
//     airport: string;
//     airportName:string;
//     date: string;
//   };
//   duration: string;
//   stops: number;
//   price: {
//     amount: number;
//     currency: string;
//   };
//   emissions: {
//     co2: number;
//     percentage: number;
//   };
//   legroom?: string;
//   contrailPotential?: string;
// }


export interface Flight {
  id: string;
  price: {
    raw: number;
    formatted: string;
    pricingOptionId: string;
  };
  legs: FlightLeg[];
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: FarePolicy;
  fareAttributes: Record<string, unknown>;
  tags: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
}

export interface FlightLeg {
  id: string;
  origin: FlightPlace;
  destination: FlightPlace;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string; // ISO string (e.g. 2025-07-05T08:35:00)
  arrival: string;
  timeDeltaInDays: number;
  carriers: {
    marketing: Carrier[];
    operationType: string;
  };
  segments: FlightSegment[];
}

export interface FlightSegment {
  id: string;
  origin: FlightPlaceDetailed;
  destination: FlightPlaceDetailed;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
}

export interface FlightPlace {
  id: string;
  entityId: string;
  name: string;
  displayCode: string;
  city: string;
  country: string;
  isHighlighted: boolean;
}

export interface FlightPlaceDetailed {
  flightPlaceId: string;
  displayCode: string;
  parent: {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
  };
  name: string;
  type: string;
  country: string;
}

export interface Carrier {
  id: number;
  name: string;
  alternateId: string;
  allianceId: number;
  logoUrl?: string;
  displayCode?: string;
}

export interface FarePolicy {
  isChangeAllowed: boolean;
  isPartiallyChangeable: boolean;
  isCancellationAllowed: boolean;
  isPartiallyRefundable: boolean;
}


export interface FlightSearchResult {
  outbound: Flight[];
  inbound?: Flight[];
  cheapest?: Flight;
  fastest?: Flight;
  best?: Flight;
}

export type SortOption = 'best' | 'cheapest' | 'quickest';
export type TripType = 'round_trip' | 'one_way' | 'multi_city';
export type TravelClass = 'economy' | 'premium_economy' | 'business' | 'first';
