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

/** A synthetic pin derived from a project's venue country */
export interface VenuePin {
  /** Unique key: `venue-{projectId}-{userId}` */
  key: string;
  latitude: number;
  longitude: number;
  country: string;
  /** All projects at this venue for this user */
  projects: AlumniPinProject[];
  /** The user who participated */
  participant: {
    id: number;
    name: string;
    organization: AlumniPin["organization"];
  };
  is_me: boolean;
}
