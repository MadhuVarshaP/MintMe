"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  contentClassName?: string
}

export function Dropdown({ children, content, className, contentClassName }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {isOpen && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px] animate-in fade-in-0 zoom-in-95 duration-200",
            contentClassName
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}