"use client"

// Example companies with branches and addresses
export const companies = [
  {
    id: "cmp-1",
    name: "Grafizen Electronics Pvt Ltd",
    branches: [
      {
        id: "b-rajkot",
        name: "Rajkot Main",
        address: "27 Navjyot Park, 150 Ft Ring Road, Rajkot – 360005",
      },
      {
        id: "b-kuvadva",
        name: "Kuvadva",
        address: "Plot No. 28–30, Near Wankaner Chowkdi, Kuvadva, Rajkot – 360023",
      },
      {
        id: "b-ahm",
        name: "Ahmedabad",
        address: "3rd Floor, Tech Park, Satellite Road, Ahmedabad – 380015",
      },
    ],
  },
  {
    id: "cmp-2",
    name: "Hygo Retail India",
    branches: [
      { id: "b-surat", name: "Surat City", address: "Ring Road, Textile Market, Surat – 395002" },
      { id: "b-vapi", name: "Vapi", address: "GIDC, Phase 3, Vapi – 396195" },
    ],
  },
]

export const deviceTypes = ["Mobile", "Laptop", "Tab", "iPhone"]
