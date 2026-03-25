import { NextRequest, NextResponse } from "next/server";
import { fetchAdemeRecords } from "@/lib/ademe";
import { ademeToMapPoint } from "@/lib/transform";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const department = searchParams.get("department") || "62";
  const chauffage = searchParams.get("chauffage");
  const surfaceMin = searchParams.get("surfaceMin");

  try {
    const data = await fetchAdemeRecords({
      department,
      etiquetteDpe: ["F", "G"],
      typeEnergieChauffage: chauffage && chauffage !== "Tous" ? chauffage : undefined,
      surfaceMin: surfaceMin ? parseFloat(surfaceMin) : undefined,
      typeBatiment: "maison",
      size: 500,
    });

    const points = data.results
      .filter((r) => r.latitude_ban && r.longitude_ban)
      .map(ademeToMapPoint);

    return NextResponse.json({ points, total: data.total });
  } catch (error) {
    console.error("ADEME API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
