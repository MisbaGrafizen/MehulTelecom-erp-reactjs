import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle } from "lucide-react";
import { useState, useMemo } from "react";

export default function ImeiModal({ isOpen, onClose, modelName }) {
  // IMEI state
  const [imeiList, setImeiList] = useState([
    "359845679223456",
    "358012457895321",
    "359002457789654",
    "351234564789653",
  ]);
  const [search, setSearch] = useState("");
  const [selectedImeis, setSelectedImeis] = useState([]);

  // Filter based on search term
  const filteredImei = useMemo(() => {
    if (!search) return imeiList;
    return imeiList.filter((imei) =>
      imei.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, imeiList]);

  // Add new IMEI if not found
  const handleAddImei = () => {
    const trimmed = search.trim();
    if (trimmed === "") return;
    if (!imeiList.includes(trimmed)) {
      setImeiList([...imeiList, trimmed]);
    }
    setSearch("");
  };

  // Toggle checkbox selection
  const handleCheckboxChange = (imei) => {
    setSelectedImeis((prev) =>
      prev.includes(imei)
        ? prev.filter((i) => i !== imei)
        : [...prev, imei]
    );
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
          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-[560px] min-h-[600px] rounded-lg shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-blue-500 px-5 py-3">
              <h2 className="text-white font-semibold font-Poppins text-[16px]">
                {modelName || "Phone Model"}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {/* Input + Add button */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search or enter new IMEI..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-Poppins outline-none "
                />
                <button
                  onClick={handleAddImei}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
                >
                  <PlusCircle size={16} />
                  Add
                </button>
              </div>

              {/* IMEI List */}
              <div className="max-h-[200px] overflow-y-auto border border-gray-200 rounded-md">
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
                        className="accent-blue-500 cursor-pointer"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
