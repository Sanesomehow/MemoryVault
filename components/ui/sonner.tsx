"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#0f172a",
          "--normal-border": "#e2e8f0",
          "--success-bg": "#f0fdf4",
          "--success-text": "#15803d", 
          "--success-border": "#bbf7d0",
          "--error-bg": "#fef2f2",
          "--error-text": "#dc2626",
          "--error-border": "#fecaca",
          "--info-bg": "#eff6ff",
          "--info-text": "#2563eb",
          "--info-border": "#bfdbfe",
          "--warning-bg": "#fffbeb",
          "--warning-text": "#d97706",
          "--warning-border": "#fed7aa",
          "--border-radius": "0.5rem",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "500",
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
