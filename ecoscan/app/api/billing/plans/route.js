import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/billing/plans/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    const body = await response.text()

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements depuis l’API :", error)
    return NextResponse.json(
      { detail: "Le service des abonnements est indisponible." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }
}
