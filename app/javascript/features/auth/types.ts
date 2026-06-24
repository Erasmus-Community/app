import type React from "react";
import type { Organization } from "../organization/types";

export interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  /** Role within their primary (owned) organization */
  org_role: "member" | "org_admin";
  organization_id?: number;
  latitude?: number;
  longitude?: number;
  current_city?: string;
  current_country?: string;
  map_visibility: "everyone" | "connections";
  bio?: string;
}

/**
 * Returned by GET /api/v1/me.
 * organization is the org the user owns (org_admin), or the first org they
 * belong to, or null if they haven't joined any yet.
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
