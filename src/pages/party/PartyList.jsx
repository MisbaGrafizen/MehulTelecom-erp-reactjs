
import { useState, useEffect } from "react"
import { Eye, Plus, X, Upload, Search, MoreVertical, Printer, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SideBar from "../../Component/sidebar/SideBar"
import Header from "../../Component/header/Header"

export default function PartyList() {
    const [parties, setParties] = useState([])
  const [filteredParties, setFilteredParties] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedParty, setSelectedParty] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedRows, setExpandedRows] = useState({})
  const [formData, setFormData] = useState({
    partyName: "",
    phone: "",
    email: "",
    billingAddress: "",
    creditLimit: "",
    balance: "",
    photo: null,
    photoPreview: null,
  })
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    const savedParties = localStorage.getItem("parties")
    if (savedParties) {
      const parsedParties = JSON.parse(savedParties)
      setParties(parsedParties)
      setFilteredParties(parsedParties)
    }
  }, [])

  useEffect(() => {
    let filtered = parties

    if (searchTerm) {
      filtered = filtered.filter(
        (party) =>
          party.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          party.phone.includes(searchTerm) ||
          party.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((party) => {
        const balance = Number.parseFloat(party.balance) || 0
        if (filterStatus === "active") return balance >= 0
        if (filterStatus === "inactive") return balance < 0
        return true
      })
    }

    setFilteredParties(filtered)
  }, [searchTerm, filterStatus, parties])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
          photoPreview: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddParty = (e) => {
    e.preventDefault()
    if (!formData.partyName || !formData.phone) {
      alert("Please fill in required fields")
      return
    }

    const newParty = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toLocaleDateString(),
      purchases: [],
      sales: [],
    }

    const updatedParties = [...parties, newParty]
    setParties(updatedParties)
    localStorage.setItem("parties", JSON.stringify(updatedParties))

    setFormData({
      partyName: "",
      phone: "",
      email: "",
      billingAddress: "",
      creditLimit: "",
      balance: "",
      photo: null,
      photoPreview: null,
    })
    setShowModal(false)
  }

  const handleViewDetails = (party) => {
    setSelectedParty(party)
    setShowDetailsModal(true)
  }

  const handleDeleteParty = (id) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      const updatedParties = parties.filter((p) => p.id !== id)
      setParties(updatedParties)
      localStorage.setItem("parties", JSON.stringify(updatedParties))
    }
  }

  const handleEditParty = (party) => {
    setFormData({
      partyName: party.partyName,
      phone: party.phone,
      email: party.email,
      billingAddress: party.billingAddress,
      creditLimit: party.creditLimit,
      balance: party.balance,
      photo: null,
      photoPreview: party.photoPreview,
    })
    setSelectedParty(party)
    setShowModal(true)
  }

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (

    <>

      <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] overflow-hidden">
        <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
          <Header pageName=" Party List" />
          <div className="flex gap-[10px] w-[100%] h-[100%]">
            <SideBar />
            <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] gap-[30px] rounded-[10px]">
              <div className="flex flex-col gap-[15px] w-[100%]">
{/* 
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Party Management</h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Add New Party
            </button>
          </div>
        </div>
      </div> */}

      <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
            >
              <option value="all">All Parties</option>
              <option value="active">Active (Balance ≥ 0)</option>
              <option value="inactive">Inactive (Balance &lt; 0)</option>
            </select>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4  w-[100%] py-8">
        {filteredParties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No parties found. Add one to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100 border-b border-gray-300">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice No.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Party Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Balance</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParties.map((party, index) => (
                    <motion.tr
                      key={party.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{party.createdAt}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">INV-{party.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{party.partyName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{party.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{party.email || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{party.creditLimit}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`font-semibold ${Number.parseFloat(party.balance) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ₹{party.balance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(party)}
                            className="text-gray-600 hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            className="text-gray-600 hover:text-gray-800 transition p-2 hover:bg-gray-100 rounded"
                            title="Print"
                          >
                            <Printer size={18} />
                          </button>

                          <button
                            className="text-gray-600 hover:text-gray-800 transition p-2 hover:bg-gray-100 rounded"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === party.id ? null : party.id)}
                              className="text-gray-600 hover:text-gray-800 transition p-2 hover:bg-gray-100 rounded"
                              title="More options"
                            >
                              <MoreVertical size={18} />
                            </button>

                            <AnimatePresence>
                              {openMenuId === party.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                >
                                  <button
                                    onClick={() => {
                                      handleEditParty(party)
                                      setOpenMenuId(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-gray-900 hover:bg-blue-50 transition first:rounded-t-lg"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteParty(party.id)
                                      setOpenMenuId(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition last:rounded-b-lg"
                                  >
                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">{selectedParty ? "Edit Party" : "Create New Party"}</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedParty(null)
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddParty} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="partyName"
                  placeholder="Party Name"
                  value={formData.partyName}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="number"
                  name="creditLimit"
                  placeholder="Credit Limit"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="number"
                  name="balance"
                  placeholder="Balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <textarea
                name="billingAddress"
                placeholder="Billing Address"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Document Upload</label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {formData.photoPreview ? (
                      <img
                        src={formData.photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-32 object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="text-gray-400" size={32} />
                        <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedParty(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showDetailsModal && selectedParty && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto font-Poppins"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-900">Party Details</h2>
          <p className="text-sm text-slate-500">View contact, balance, and transaction summary</p>
        </div>
        <button
          onClick={() => setShowDetailsModal(false)}
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X size={22} className="text-slate-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* SUMMARY SECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Party Name</p>
            <p className="mt-1 text-[16px] font-semibold text-slate-800">{selectedParty.partyName}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Phone</p>
            <p className="mt-1 text-[14px] font-medium text-slate-800">{selectedParty.phone}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
            <p className="mt-1 text-[14px] text-slate-800">{selectedParty.email || "N/A"}</p>
          </div>
        </div>

        {/* ADDRESS + CREDIT INFO */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Billing Address</p>
            <p className="text-[14px] text-slate-800 leading-snug">
              {selectedParty.billingAddress || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 border border-slate-200 rounded-xl bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Credit Limit</p>
              <p className="text-[15px] font-bold text-blue-700">
                ₹{selectedParty.creditLimit || 0}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Balance</p>
              <p
                className={`text-[15px] font-bold ${
                  Number(selectedParty.balance) >= 0 ? "text-green-700" : "text-rose-600"
                }`}
              >
                ₹{selectedParty.balance}
              </p>
            </div>
          </div>
        </div>

        {/* PURCHASES & SALES */}
        <div className="space-y-5">
          {/* PURCHASES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleRowExpand(`purchases-${selectedParty.id}`)}
              className="w-full px-5 py-3 bg-blue-50 hover:bg-blue-100 flex items-center justify-between transition"
            >
              <h3 className="font-semibold text-slate-800 text-[15px]">
                Purchases ({selectedParty.purchases?.length || 0})
              </h3>
              <motion.div
                animate={{ rotate: expandedRows[`purchases-${selectedParty.id}`] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedRows[`purchases-${selectedParty.id}`] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-slate-200 bg-white"
                >
                  <div className="p-4 space-y-2">
                    {selectedParty.purchases?.length ? (
                      selectedParty.purchases.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <p className="text-sm font-medium text-slate-800">{p.item || "Purchase"}</p>
                          <p className="text-sm font-semibold text-blue-700">₹{p.amount}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No purchases recorded</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* SALES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleRowExpand(`sales-${selectedParty.id}`)}
              className="w-full px-5 py-3 bg-green-50 hover:bg-green-100 flex items-center justify-between transition"
            >
              <h3 className="font-semibold text-slate-800 text-[15px]">
                Sales ({selectedParty.sales?.length || 0})
              </h3>
              <motion.div
                animate={{ rotate: expandedRows[`sales-${selectedParty.id}`] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedRows[`sales-${selectedParty.id}`] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-slate-200 bg-white"
                >
                  <div className="p-4 space-y-2">
                    {selectedParty.sales?.length ? (
                      selectedParty.sales.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition"
                        >
                          <p className="text-sm font-medium text-slate-800">{s.item || "Sale"}</p>
                          <p className="text-sm font-semibold text-green-700">₹{s.amount}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No sales recorded</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* DOCUMENT PREVIEW */}
        {selectedParty.photoPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-slate-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-700 mb-2">Party Document</p>
            <img
              src={selectedParty.photoPreview}
              alt={selectedParty.partyName}
              className="w-full h-56 object-cover rounded-lg border border-slate-100"
            />
          </motion.div>
        )}

    
      </div>
    </motion.div>
  </div>
)}

    </div>
              </div>
              </div>
              </div>
            
              </section>




</>



  )
}
