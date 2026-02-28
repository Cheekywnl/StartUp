import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url || !url.includes("github.com")) {
    return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
  }

  try {
    const repoUrl = url.replace(/\/$/, "")
    const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/)
    if (!match) return NextResponse.json({ error: "Invalid repo URL" }, { status: 400 })
    const readmeUrl = `https://api.github.com/repos/${match[1]}/readme`

    const res = await fetch(readmeUrl, {
      headers: { Accept: "application/vnd.github.raw" },
    })

    if (!res.ok) {
      return NextResponse.json({ summary: "Could not fetch GitHub (private or not found)" })
    }

    const text = await res.text()
    const summary = text.slice(0, 2000)
    return NextResponse.json({ summary })
  } catch {
    return NextResponse.json({ summary: null })
  }
}
