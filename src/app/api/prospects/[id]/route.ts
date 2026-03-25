import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const prospect = await prisma.prospect.findUnique({
    where: { id },
    select: {
      id: true,
      city: true,
      postalCode: true,
      department: true,
      etiquetteDpe: true,
      typeBatiment: true,
      typeEnergieChauffage: true,
      surfaceHabitable: true,
      score: true,
      consommationEnergie: true,
      emissionGes: true,
      anneeConstruction: true,
      nbNiveaux: true,
      isolationMurs: true,
      isolationToiture: true,
      isolationPlancher: true,
      typeVitrage: true,
      typeEnergieEcs: true,
      dateEtablissementDpe: true,
      proprietaireNom: true,
      latitude: true,
      longitude: true,
    },
  });

  if (!prospect) {
    return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 });
  }

  // TODO: check if user has unlocked this prospect to return full info
  // For now, return public fields only

  return NextResponse.json(prospect);
}
