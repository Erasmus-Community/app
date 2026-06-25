export interface AlumniPin {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  current_city?: string;
  current_country?: string;
  bio?: string;
  is_me: boolean;
  organization: {
    id: number;
    name: string;
    country: string;
  };
  projects: AlumniPinProject[];
}

export interface AlumniPinProject {
  id: number;
  title: string;
  project_type: string;
  key_action: string;
  venue_country?: string;
  starts_on?: string;
}

export interface VenueParticipant {
  id: number;
  name: string;
  organization: AlumniPin["organization"];
  is_me: boolean;
  /** Projects this participant attended at this venue */
  projects: AlumniPinProject[];
}

/** One pin per distinct venue country — aggregates all participants across all users */
export interface VenuePin {
  /** Unique key: `venue-{country}` */
  key: string;
  latitude: number;
  longitude: number;
  country: string;
  participants: VenueParticipant[];
}
