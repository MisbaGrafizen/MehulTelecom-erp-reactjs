"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, X, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function cn(...a) {
  return a.filter(Boolean).join(" ")
}

export function useOnClickOutside(ref, cb) {
  useEffect(() => {
    function onDoc(e) {
      if (!ref.current || ref.current.contains(e.target)) return
      cb?.()
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("touchstart", onDoc)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("touchstart", onDoc)
    }
  }, [ref, cb])
}

export function Badge({ tone = "slate", children, className = "" }) {
  const map = {
    slate: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-700",
  }
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", map[tone], className)}>
      {children}
    </span>
  )
}

export function Dropdown({ label, options = [], value, onChange, leadingIcon = null, className = "" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false))
  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-[7px] border border-gray-300 bg-white px-3 py-2 text-sm font-[500] text-gray-800 shadow-sm hover:bg-gray-50"
      >
        {leadingIcon}
        <span className="truncate">{label ?? value ?? "Select"}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute z-40 mt-2 max-h-64 w-60 overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={typeof opt === "string" ? opt : opt.value}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100",
                  value === (opt.value ?? opt) && "bg-rose-50",
                )}
                onClick={() => {
                  onChange?.(opt.value ?? opt)
                  setOpen(false)
                }}
              >
                <span className="truncate">{opt.label ?? opt}</span>
                {value === (opt.value ?? opt) ? <Check size={16} className="text-rose-600" /> : null}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Modal({ open, title, onClose, children, width = "max-w-2xl" }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className={cn("w-full rounded-2xl bg-white p-5 shadow-xl", width)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-extrabold text-gray-900">{title}</h4>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function Toast({ message, onDismiss }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed bottom-4 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-gray-400 px-4 py-2 text-sm font-[500] text-white shadow-lg"
        >
          {message}
          <button onClick={onDismiss} className="ml-3 rounded bg-white/10 px-2 py-0.5">
            Dismiss
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
