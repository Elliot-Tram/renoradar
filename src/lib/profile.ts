export interface ArtisanProfile {
  company: string;
  specialty: string;
  city: string;
  department: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

const STORAGE_KEY = "renoradar_profile";
const ADMIN_KEY = "renoradar_admin";
const ADMIN_PASSWORD = "demo1234";

export function checkAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function activateAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
}

export function isAdmin(): boolean {
  return checkAdmin();
}

export function getProfile(): ArtisanProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProfile(profile: ArtisanProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function hasProfile(): boolean {
  return getProfile() !== null;
}

/**
 * Convertit un rayon en km en zoom Leaflet approximatif.
 */
export function radiusToZoom(radiusKm: number): number {
  if (radiusKm <= 5) return 13;
  if (radiusKm <= 10) return 12;
  if (radiusKm <= 20) return 11;
  if (radiusKm <= 30) return 10;
  if (radiusKm <= 50) return 9;
  return 8;
}

/**
 * Extrait le code département d'un contexte BAN.
 * Ex: "62, Pas-de-Calais, Hauts-de-France" → "62"
 */
export function extractDepartment(context: string): string {
  return context.split(",")[0].trim();
}
