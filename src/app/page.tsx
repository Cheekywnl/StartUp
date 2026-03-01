"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useApp } from "@/context/AppContext"
import { MainDashboard } from "@/components/MainDashboard"

const CreateAccountPage = dynamic(() => import("./create-account/page"), { ssr: false })

export default function HomePage() {
  const router = useRouter()
  const { accountData, investorAccount, isHydrated } = useApp()

  useEffect(() => {
    if (!isHydrated) return
    if (investorAccount) {
      router.replace("/investors")
    }
  }, [isHydrated, investorAccount, router])

  if (!isHydrated) {
    return (
      <div style={{ padding: "40px 32px", maxWidth: "560px", margin: "0 auto", textAlign: "center", color: "#888" }}>
        Loading…
      </div>
    )
  }

  if (investorAccount) {
    return null
  }

  if (accountData) {
    return <MainDashboard />
  }

  return <CreateAccountPage />
}
