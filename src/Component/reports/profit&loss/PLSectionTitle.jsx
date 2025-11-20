export default function PLSectionTitle({ title }) {
  return (
    <div className="py-2">
      <h3 className="text-xs uppercase font-bold text-slate-600 tracking-widest">
        {title}
      </h3>
      <div className="h-px bg-slate-200 mt-3" />
    </div>
  )
}
