import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSurfaceRange } from "@/lib/scoring";
import type { ProspectPublic } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const department = searchParams.get("department") || "62";
  const dpe = searchParams.get("dpe")?.split(",") || ["F", "G"];
  const chauffage = searchParams.get("chauffage");
  const surfaceMin = searchParams.get("surfaceMin");
  const typeBatiment = searchParams.get("typeBatiment");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 20;

  const where: any = {
    department,
    etiquetteDpe: { in: dpe },
  };

  if (chauffage) where.typeEnergieChauffage = chauffage;
  if (surfaceMin) where.surfaceHabitable = { gte: parseFloat(surfaceMin) };
  if (typeBatiment) where.typeBatiment = typeBatiment;

  const [prospects, total] = await Promise.all([
    prisma.prospect.findMany({
      where,
      orderBy: { score: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        city: true,
        department: true,
        postalCode: true,
        etiquetteDpe: true,
        typeBatiment: true,
        typeEnergieChauffage: true,
        surfaceHabitable: true,
        score: true,
        proprietaireNom: true,
        latitude: true,
        longitude: true,
      },
    }),
    prisma.prospect.count({ where }),
  ]);

  const results: ProspectPublic[] = prospects.map((p) => ({
    id: p.id,
    city: p.city,
    department: p.department,
    postalCode: p.postalCode,
    etiquetteDpe: p.etiquetteDpe,
    typeBatiment: p.typeBatiment,
    typeEnergieChauffage: p.typeEnergieChauffage,
    surfaceRange: getSurfaceRange(p.surfaceHabitable),
    score: p.score,
    hasOwnerInfo: !!p.proprietaireNom,
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return NextResponse.json({
    results,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  });
}
