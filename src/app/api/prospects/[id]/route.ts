import { NextRequest, NextResponse } from "next/server";
import { fetchAdemeByDpeId } from "@/lib/ademe";
import { ademeToDetail } from "@/lib/transform";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;

  const specialty = searchParams.get("specialty") || undefined;
  const artisanLat = searchParams.get("artisanLat") ? parseFloat(searchParams.get("artisanLat")!) : undefined;
  const artisanLng = searchParams.get("artisanLng") ? parseFloat(searchParams.get("artisanLng")!) : undefined;

  try {
    const record = await fetchAdemeByDpeId(id);

    if (!record) {
      return NextResponse.json(
        { error: "Prospect non trouvé" },
        { status: 404 }
      );
    }

    const ctx = { specialty, artisanLat, artisanLng };
    const detail = ademeToDetail(record, ctx);

    if (!detail) {
      return NextResponse.json(
        { error: "Données géographiques manquantes" },
        { status: 404 }
      );
    }

    return NextResponse.json(detail);
  } catch (error) {
    console.error("ADEME API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
