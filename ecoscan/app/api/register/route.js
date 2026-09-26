import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ detail: "Le contenu de la demande est invalide." }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/onboarding/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
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
    console.error("Impossible de transmettre la demande d’onboarding au backend :", error)
    return NextResponse.json(
      { detail: "Le service d’inscription est indisponible. Veuillez réessayer." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }
}
