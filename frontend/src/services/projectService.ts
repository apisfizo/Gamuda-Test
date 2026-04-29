import { api } from "./api";
import type { Project, ProjectCreate, ProjectUpdate, TokenResponse } from "../utils/types";

export const authService = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const form = new URLSearchParams({ username, password });
    const { data } = await api.post<TokenResponse>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },
  async me(): Promise<{ username: string }> {
    const { data } = await api.get<{ username: string }>("/auth/me");
    return data;
  },
};

export const projectService = {
  async list(params?: { search?: string; status?: string }): Promise<Project[]> {
    const { data } = await api.get<Project[]>("/projects", { params });
    return data;
  },
  async get(id: number): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },
  async create(payload: ProjectCreate): Promise<Project> {
    const { data } = await api.post<Project>("/projects", payload);
    return data;
  },
  async update(id: number, payload: ProjectUpdate): Promise<Project> {
    const { data } = await api.put<Project>(`/projects/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
