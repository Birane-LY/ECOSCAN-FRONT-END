/**
 * Filter organizations by query and status.
 * @param {Array} orgs
 * @param {string} query
 * @param {string} statusFilter
 * @returns {Array}
 */
export function filterOrganizations(orgs, query = '', statusFilter = 'Toutes') {
  return orgs.filter((o) => {
    const matchesStatus = statusFilter === 'Toutes' || o.status === statusFilter
    const matchesQuery = `${o.name} ${o.sector} ${o.email}`.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  })
}

/**
 * Filter invoices by search term.
 * @param {Array} invoices
 * @param {string} query
 * @returns {Array}
 */
export function filterInvoices(invoices, query = '') {
  return invoices.filter((i) =>
    `${i.id} ${i.org}`.toLowerCase().includes(query.toLowerCase())
  )
}
