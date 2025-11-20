'use client'

export default function Badge({ type }) {
  const styles = {
    Sale: 'bg-blue-100 text-blue-700 border-blue-300',
    Purchase: 'bg-green-100 text-green-700 border-green-300',
    Transfer: 'bg-orange-100 text-orange-700 border-orange-300'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[type] || ''}`}>
      {type}
    </span>
  )
}
