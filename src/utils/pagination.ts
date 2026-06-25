export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | 'ellipsis')[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : []

  const totalNumbers = siblingCount * 2 + 5

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]
  const leftSibling = Math.max(currentPage - siblingCount, 2)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (showLeftEllipsis) pages.push('ellipsis')
  else {
    for (let i = 2; i < leftSibling; i++) pages.push(i)
  }

  for (let i = leftSibling; i <= rightSibling; i++) pages.push(i)

  if (showRightEllipsis) pages.push('ellipsis')
  else {
    for (let i = rightSibling + 1; i < totalPages; i++) pages.push(i)
  }

  pages.push(totalPages)
  return pages
}

export function getPaginationRange(page: number, pageSize: number, totalItems: number) {
  if (totalItems === 0) return { from: 0, to: 0 }

  const from = page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, totalItems)
  return { from, to }
}
