export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed";

export interface Project {
  id: number;
  title: string;
  description: string | null;
  status: ProjectStatus;
  owner: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  status: ProjectStatus;
  owner: string;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  owner?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
