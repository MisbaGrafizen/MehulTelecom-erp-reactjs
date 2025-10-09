"use client"

// A tiny localStorage store for stock transfers

const KEY = "__stock_transfers__v1__"

export function loadTransfers() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTransfers(list) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function addTransfer(t) {
  const list = loadTransfers()
  list.unshift(t)
  saveTransfers(list)
}

export function updateTransfer(id, patch) {
  const list = loadTransfers()
  const idx = list.findIndex((x) => x.id === id)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch }
    saveTransfers(list)
  }
  return list
}

export function removeTransfer(id) {
  const list = loadTransfers().filter((x) => x.id !== id)
  saveTransfers(list)
  return list
}
