export interface Organization {
  id: number;
  name: string;
  country: string;
  status: "waitlisted" | "approved" | "rejected";
  oid?: string;
  website?: string;
  description?: string;
  key_actions: string[];
  expertises: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  org_role: "member" | "org_admin";
  organization_id?: number;
  latitude?: number;
  longitude?: number;
  current_city?: string;
  current_country?: string;
  map_visibility: "everyone" | "connections";
  bio?: string;
}

export interface MeResponse {
  user: User;
  organization: Organization | null;
}

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
    name: string;
    country: string;
  };
  projects: {
    id: number;
    title: string;
    project_type: string;
    venue_country?: string;
    starts_on?: string;
  }[];
}

export interface AuthContextValue {
  me: MeResponse | null;
  setMe: React.Dispatch<React.SetStateAction<MeResponse | null>>;
  loading: boolean;
}
