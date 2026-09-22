// Filtres purs, testables séparément de l'affichage.

export function filterOrganizations(orgs, query, status) {
  const q = query.trim().toLowerCase()
  return orgs.filter((o) => {
    const matchQuery = !q || `${o.name} ${o.sector}`.toLowerCase().includes(q)
    const matchStatus = status === 'Toutes' || o.status === status
    return matchQuery && matchStatus
  })
}

export function filterInvoices(invoices, query) {
  const q = query.trim().toLowerCase()
  if (!q) return invoices
  return invoices.filter((i) => `${i.id} ${i.org}`.toLowerCase().includes(q))
}
