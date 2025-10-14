"use client"

// Local storage store for inventory items and transactions
const KEY_ITEMS = "__inv_items_v1__"
const KEY_TXNS = "__inv_txns_v1__"

export function loadItems() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY_ITEMS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
export function loadTxns() {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY_TXNS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
export function saveItems(list) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_ITEMS, JSON.stringify(list))
}
export function saveTxns(list) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_TXNS, JSON.stringify(list))
}

// CRUD: Items
export function addItem(item) {
  const list = loadItems()
  list.unshift(item)
  saveItems(list)
  return list
}
export function updateItem(id, patch) {
  const list = loadItems()
  const i = list.findIndex((x) => x.id === id)
  if (i >= 0) {
    list[i] = { ...list[i], ...patch }
    saveItems(list)
  }
  return list
}
export function removeItem(id) {
  const items = loadItems().filter((x) => x.id !== id)
  const txns = loadTxns().filter((t) => t.itemId !== id)
  saveItems(items)
  saveTxns(txns)
  return { items, txns }
}

// CRUD: Transactions
export function addTxn(txn) {
  const list = loadTxns()
  list.unshift(txn)
  saveTxns(list)
  return list
}
export function updateTxn(id, patch) {
  const list = loadTxns()
  const i = list.findIndex((x) => x.id === id)
  if (i >= 0) {
    list[i] = { ...list[i], ...patch }
    saveTxns(list)
  }
  return list
}
export function removeTxn(id) {
  const list = loadTxns().filter((t) => t.id !== id)
  saveTxns(list)
  return list
}

// Seed demo data on first run
export function ensureSeed() {
  const items = loadItems()
  const txns = loadTxns()
  if (items.length || txns.length) return { items, txns }

  const demoItems = [
    { id: "it-1", name: "I PHONE 11PRO 256", color: "—", salePrice: 21000, purchasePrice: 15000, qty: 1 },
    { id: "it-2", name: "I PHONE 11PROMAX", color: "—", salePrice: 21000, purchasePrice: 15000, qty: 1 },
    { id: "it-3", name: "I PHONE 12 64 BLACK", color: "BLACK", salePrice: 21000, purchasePrice: 15000, qty: 3 },
    { id: "it-4", name: "I PHONE 12 64 BLUE", color: "BLUE", salePrice: 21000, purchasePrice: 15000, qty: 2 },
    { id: "it-5", name: "I PHONE 12 64 MINT", color: "MINT", salePrice: 21000, purchasePrice: 15000, qty: 4 },
    { id: "it-6", name: "I PHONE 12 64 PURPLE", color: "PURPLE", salePrice: 21000, purchasePrice: 15000, qty: 14 },
    { id: "it-7", name: "I PHONE 12 64 RED", color: "RED", salePrice: 21000, purchasePrice: 15000, qty: 4 },
    { id: "it-8", name: "I PHONE 12 64 WHITE", color: "WHITE", salePrice: 21000, purchasePrice: 15000, qty: 13 },
    { id: "it-9", name: "I PHONE 12MINI 128", color: "—", salePrice: 20000, purchasePrice: 14000, qty: 4 },
  ]
  const today = new Date()
  const fmt = (d) => d.toISOString().substring(0, 10)
  const demoTxns = [
    {
      id: "tx-1",
      itemId: "it-8",
      type: "Sale",
      invoice: "391",
      party: "BHARGAV KARELIYA",
      date: fmt(today),
      qty: 1,
      price: 21000,
      status: "Paid",
      note: "",
    },
    {
      id: "tx-2",
      itemId: "it-8",
      type: "Sale",
      invoice: "298",
      party: "SANJAY UPSARIYA",
      date: fmt(new Date(today.getTime() - 86400000)),
      qty: 1,
      price: 21000,
      status: "Paid",
      note: "",
    },
    {
      id: "tx-3",
      itemId: "it-8",
      type: "Purchase",
      invoice: "PO-7731",
      party: "AAQIB TELECOM",
      date: fmt(new Date(today.getTime() - 5 * 86400000)),
      qty: 18,
      price: 18000,
      status: "Paid",
      note: "",
    },
  ]

  saveItems(demoItems)
  saveTxns(demoTxns)
  return { items: demoItems, txns: demoTxns }
}
