"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import type { AccountData } from "@/lib/types"

export default function CreateAccountPage() {
  const router = useRouter()
  const { accountData, setAccountData, isHydrated } = useApp()
  const [form, setForm] = useState<AccountData>({ name: "", product: "", description: "", github: "" })

  useEffect(() => {
    if (isHydrated && accountData) {
      setForm(accountData)
    }
  }, [isHydrated, accountData])
  const [errors, setErrors] = useState<Partial<Record<keyof AccountData, string>>>({})

  const validate = (): boolean => {
    const e: Partial<Record<keyof AccountData, string>> = {}
    if (!form.name.trim()) e.name = "Name is required"
    if (!form.product.trim()) e.product = "Product is required"
    if (!form.description.trim()) e.description = "Description is required"
    else if (form.description.length < 20) e.description = "Description must be at least 20 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof AccountData]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = () => {
    if (!validate()) return
    setAccountData(form)
    router.push("/assessment")
  }

  return (
    <div style={{ padding: "40px 32px", maxWidth: "560px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Create Account
        </h1>
        <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>
          Register to connect with potential investors
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        {(
          [
            { label: "Full Name", name: "name" as keyof AccountData, placeholder: "e.g. Jane Smith", multiline: false },
            { label: "Product", name: "product" as keyof AccountData, placeholder: "e.g. Analytics Dashboard", multiline: false },
            { label: "Description", name: "description" as keyof AccountData, placeholder: "Describe your product (min 20 characters)...", multiline: true },
            { label: "GitHub URL", name: "github" as keyof AccountData, placeholder: "e.g. https://github.com/username/repo", multiline: false },
          ] as { label: string; name: keyof AccountData; placeholder: string; multiline: boolean }[]
        ).map(({ label, name, placeholder, multiline }) => (
          <div
            key={name}
            style={{
              background: "#111",
              border: `1px solid ${errors[name] ? "#ef4444" : "#1a1a1a"}`,
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: errors[name] ? "#ef4444" : "#555",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {label}
            </div>
            {multiline ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                rows={3}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "none",
                  lineHeight: 1.6,
                }}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            )}
            {errors[name] && (
              <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "6px" }}>{errors[name]}</div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          background: "linear-gradient(135deg, #405de6, #833ab4, #c13584)",
          border: "none",
          borderRadius: "12px",
          padding: "14px 28px",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Create Account →
      </button>
    </div>
  )
}
