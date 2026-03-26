import { NextRequest, NextResponse } from "next/server";
import { fetchAdemeByDpeId } from "@/lib/ademe";
import { ademeToDetail } from "@/lib/transform";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const record = await fetchAdemeByDpeId(id);

    if (!record) {
      return NextResponse.json(
        { error: "Prospect non trouvé" },
        { status: 404 }
      );
    }

    const detail = ademeToDetail(record);
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
