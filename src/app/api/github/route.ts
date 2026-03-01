import { NextRequest, NextResponse } from "next/server"

/** Normalize and parse GitHub URL to owner/repo */
function parseGitHubUrl(url: string): string | null {
  const trimmed = url.trim().replace(/\/$/, "")
  const patterns = [
    /github\.com\/([^/]+\/[^/]+?)(?:\/|$)/,
    /^([^/]+\/[^/]+)$/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }
  return null
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const verifyOnly = request.nextUrl.searchParams.get("verify") === "1"

  if (!url?.trim()) {
    return NextResponse.json({ valid: false, error: "URL required" }, { status: 400 })
  }

  const repo = parseGitHubUrl(url)
  if (!repo) {
    return NextResponse.json({
      valid: false,
      error: "Invalid GitHub URL. Use format: github.com/username/repo or https://github.com/username/repo",
    })
  }

  try {
    const readmeUrl = `https://api.github.com/repos/${repo}/readme`
    const res = await fetch(readmeUrl, {
      headers: { Accept: "application/vnd.github.raw" },
    })

    if (!res.ok) {
      return NextResponse.json({
        valid: false,
        error: "Repo not found or private",
        ...(verifyOnly ? {} : { summary: null }),
      })
    }

    const text = await res.text()
    const summary = text.slice(0, 2000)

    if (verifyOnly) {
      return NextResponse.json({ valid: true })
    }
    return NextResponse.json({ valid: true, summary })
  } catch {
    return NextResponse.json({
      valid: false,
      error: "Could not verify repository",
      summary: verifyOnly ? undefined : null,
    })
  }
}
