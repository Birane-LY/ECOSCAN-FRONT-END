import { redirect } from "next/navigation"

export default function ConnexionPage() {
  redirect(process.env.NEXT_PUBLIC_BACKOFFICE_URL || "http://localhost:3001")
}
