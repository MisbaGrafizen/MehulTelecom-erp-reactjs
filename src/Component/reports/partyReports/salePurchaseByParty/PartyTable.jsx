import PartyTableRow from "./PartyTableRow"

export default function PartyTable({ party, onViewClick }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Party Records</h2>
      <div className="space-y-2">
        <PartyTableRow party={party} onViewClick={onViewClick} />
      </div>
    </div>
  )
}
