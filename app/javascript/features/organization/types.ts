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
  languages: string[];
}

/** A user's membership in an organization */
export interface Membership {
  id: number;
  organization: Organization;
  /** owner = registered/manages the org; participant = appeared in a past project */
  role: "owner" | "participant";
}

export interface ProjectParticipant {
  id: number;
  name: string;
  email: string;
  current_city?: string;
  current_country?: string;
}

export interface Project {
  id: number;
  title: string;
  project_type: string;
  key_action: string;
  venue_country?: string;
  starts_on?: string;
  ends_on?: string;
  description?: string;
  participants: ProjectParticipant[];
}

export interface OrgProfileResponse {
  organization: Organization;
  /** The viewer's role in this org, null if not a member */
  viewer_role: "owner" | "participant" | null;
  projects: Project[];
}

export interface CreateProjectForm {
  title: string;
  project_type: string;
  key_action: string;
  venue_country: string;
  starts_on: string;
  ends_on: string;
  description: string;
}
