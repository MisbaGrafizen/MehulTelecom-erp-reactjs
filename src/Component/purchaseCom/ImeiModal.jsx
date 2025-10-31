import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ApiGet } from "../../helper/axios";
import { useLocation } from "react-router-dom";


export default function ImeiModal({
  isOpen,
  onClose,
  modelName,
  existingImeis = [],
  onSave,
}) {
  // State
  const [imeiList, setImeiList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedImeis, setSelectedImeis] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
const isPurchaseInvoicePage = location.pathname === "/purches-invoice";


  // Reset when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setImeiList([]);
      setSelectedImeis([]);
    }
  }, [isOpen]);

  // Fetch IMEIs from backend when modal opens
  useEffect(() => {
    const fetchImeis = async () => {
      if (!isOpen || !modelName) return;
      setLoading(true);
      try {
        const res = await ApiGet(`/admin/serials/${encodeURIComponent(modelName)}`);
        // Backend may return array of objects: [{number, isSold}, ...]
        let backendImeis = [];

        if (Array.isArray(res)) {
          backendImeis = res;
        } else if (Array.isArray(res?.data)) {
          backendImeis = res.data;
        } else if (res?.serials) {
          backendImeis = res.serials;
        }

        // ✅ Normalize: keep only unsold serial numbers as strings
        // ✅ Normalize & filter unsold IMEIs safely
const unsoldImeis = backendImeis
  .filter((s) => {
    // Case 1: backend returns object
    if (typeof s === "object" && s !== null) {
      return !s.isSold && s.number; // include only unsold with valid number
    }
    // Case 2: backend returns plain string
    if (typeof s === "string") {
      return true; // assume unsold if backend didn’t mark sold
    }
    return false;
  })
  .map((s) => (typeof s === "object" ? s.number : s))
  .filter(Boolean); // remove any null/undefined


        // ✅ Merge with existingImeis (avoid duplicates)
        const merged = Array.from(new Set([...unsoldImeis, ...existingImeis]));

        setImeiList(merged);
        setSelectedImeis(existingImeis || []);
      } catch (err) {
        console.error("Error fetching IMEIs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImeis();
  }, [isOpen, modelName, existingImeis]);

  // Search filter
  const filteredImei = useMemo(() => {
    if (!search) return imeiList;
    return imeiList.filter((imei) =>
      imei.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, imeiList]);

  // Add new IMEI manually
  const handleAddImei = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    if (imeiList.includes(trimmed)) {
      alert("This IMEI already exists!");
      return;
    }
    setImeiList((prev) => [...prev, trimmed]);
    setSelectedImeis((prev) => [...prev, trimmed]);
    setSearch("");
  };

  // Toggle IMEI checkbox
  const handleCheckboxChange = (imei) => {
    setSelectedImeis((prev) =>
      prev.includes(imei)
        ? prev.filter((i) => i !== imei)
        : [...prev, imei]
    );
  };

  // Save selected IMEIs
  const handleSave = () => {
    const uniqueImeis = Array.from(new Set(selectedImeis));
    onSave(uniqueImeis);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 font-Poppins bg-black/40 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-[560px] min-h-[600px] rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-[#083aef] px-5 py-3">
              <h2 className="text-white font-semibold font-Poppins text-[16px]">
                {modelName || "Select Product"}
              </h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col">
              {/* Search + Add */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search or add new IMEI..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-Poppins outline-none"
                />
{isPurchaseInvoicePage && (
  <button
    onClick={handleAddImei}
    className="flex items-center gap-1 px-3 py-2 bg-[#083aef] text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
  >
    <PlusCircle size={16} />
    Add
  </button>
)}

              </div>

              {/* Loading */}
              {loading ? (
                <div className="flex justify-center items-center flex-1 text-gray-500">
                  <Loader2 className="animate-spin mr-2" /> Loading IMEIs...
                </div>
              ) : (
                <div className="max-h-[380px] overflow-y-auto border border-gray-200 rounded-md flex-1">
                  {filteredImei.length > 0 ? (
                    filteredImei.map((imei, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 text-sm border-b border-gray-100 hover:bg-blue-50 cursor-pointer font-Poppins"
                      >
                        <input
                          type="checkbox"
                          checked={selectedImeis.includes(imei)}
                          onChange={() => handleCheckboxChange(imei)}
                          className="accent-[#083aef] cursor-pointer"
                        />
                        <span>{imei}</span>
                      </label>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center font-Poppins">
                      No IMEI found. Click “Add” to insert new one.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-[#083aef] hover:bg-blue-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save ({selectedImeis.length})
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
