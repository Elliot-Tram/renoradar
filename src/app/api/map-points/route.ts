import { NextRequest, NextResponse } from "next/server";
import { fetchAdemeRecords } from "@/lib/ademe";
import { ademeToMapPoint } from "@/lib/transform";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const department = searchParams.get("department") || "62";
  const dpe = searchParams.get("dpe")?.split(",") || ["F", "G"];
  const chauffage = searchParams.get("chauffage");
  const surfaceMin = searchParams.get("surfaceMin");
  const typeBatiment = searchParams.get("typeBatiment");
  const dateMin = searchParams.get("dateMin");
  const isolationMurs = searchParams.get("isolationMurs");
  const isolationEnveloppe = searchParams.get("isolationEnveloppe");
  const isolationMenuiseries = searchParams.get("isolationMenuiseries");
  const specialty = searchParams.get("specialty") || undefined;
  const artisanLat = searchParams.get("artisanLat") ? parseFloat(searchParams.get("artisanLat")!) : undefined;
  const artisanLng = searchParams.get("artisanLng") ? parseFloat(searchParams.get("artisanLng")!) : undefined;

  try {
    const data = await fetchAdemeRecords({
      department,
      etiquetteDpe: dpe,
      typeEnergieChauffage: chauffage && chauffage !== "Tous" ? chauffage : undefined,
      surfaceMin: surfaceMin ? parseFloat(surfaceMin) : undefined,
      typeBatiment: typeBatiment || "maison",
      dateMin: dateMin || undefined,
      isolationMurs: isolationMurs || undefined,
      isolationEnveloppe: isolationEnveloppe || undefined,
      isolationMenuiseries: isolationMenuiseries || undefined,
      size: 500,
    });

    const ctx = { specialty, artisanLat, artisanLng };

    const points = data.results
      .map((r) => ademeToMapPoint(r, ctx))
      .filter((p): p is NonNullable<typeof p> => p !== null);

    return NextResponse.json({ points, total: data.total });
  } catch (error) {
    console.error("ADEME API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
