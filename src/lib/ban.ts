const BASE_URL = "https://api-adresse.data.gouv.fr";

interface BanResult {
  label: string;
  housenumber: string;
  street: string;
  postcode: string;
  city: string;
  context: string;
  x: number;
  y: number;
  id: string; // identifiant parcelle
}

export async function geocode(address: string): Promise<BanResult | null> {
  const res = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(address)}&limit=1`
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.features?.length) return null;

  const feat = data.features[0];
  return {
    label: feat.properties.label,
    housenumber: feat.properties.housenumber || "",
    street: feat.properties.street || "",
    postcode: feat.properties.postcode,
    city: feat.properties.city,
    context: feat.properties.context,
    x: feat.geometry.coordinates[0],
    y: feat.geometry.coordinates[1],
    id: feat.properties.id,
  };
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<BanResult | null> {
  const res = await fetch(`${BASE_URL}/reverse?lon=${lon}&lat=${lat}`);
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.features?.length) return null;

  const feat = data.features[0];
  return {
    label: feat.properties.label,
    housenumber: feat.properties.housenumber || "",
    street: feat.properties.street || "",
    postcode: feat.properties.postcode,
    city: feat.properties.city,
    context: feat.properties.context,
    x: feat.geometry.coordinates[0],
    y: feat.geometry.coordinates[1],
    id: feat.properties.id,
  };
}
