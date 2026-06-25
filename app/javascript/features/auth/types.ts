import type React from "react";
import type { Organization } from "../organization/types";

export interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  /** True if this user owns an organization */
  is_owner: boolean;
  latitude?: number;
  longitude?: number;
  current_city?: string;
  current_country?: string;
  map_visibility: "everyone" | "connections";
  bio?: string;
}

/**
 * Returned by GET /api/v1/me.
 * organization is the org this user owns, or null.
 */
export interface MeResponse {
  user: User;
  organization: Organization | null;
}

export interface AuthContextValue {
  me: MeResponse | null;
  setMe: React.Dispatch<React.SetStateAction<MeResponse | null>>;
  loading: boolean;
}
