/**
 * Markdown 表格解析器
 */
export function parseTable(text) {
  const tableRegex = /(\|.+\|[\r\n]+)(\|[\s]*:?-+:?[\s]*\|[\s]*:?-+:?[\s]*\|.*[\r\n]+)((?:\|.+\|[\r\n]*)+)/g

  return text.replace(tableRegex, function(match, header, separator, body) {
    const headers = header.trim().split('|').filter(function(cell) {
      return cell.trim()
    })

    const alignments = separator.trim().split('|').filter(function(cell) {
      return cell.trim()
    }).map(function(cell) {
      const trimmed = cell.trim()
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center'
      if (trimmed.endsWith(':')) return 'right'
      return 'left'
    })

    const rows = body.trim().split('\n').filter(function(row) {
      return row.trim()
    })

    let tableHtml = '<div style="overflow-x: auto;"><table><thead><tr>'

    headers.forEach(function(header, index) {
      const align = alignments[index] || 'left'
      tableHtml += '<th style="text-align: ' + align + '">' + header.trim() + '</th>'
    })
    tableHtml += '</tr></thead><tbody>'

    rows.forEach(function(row) {
      const cells = row.trim().split('|').filter(function(cell) {
        return cell.trim()
      })
      tableHtml += '<tr>'
      cells.forEach(function(cell, index) {
        const align = alignments[index] || 'left'
        tableHtml += '<td style="text-align: ' + align + '">' + cell.trim() + '</td>'
      })
      tableHtml += '</tr>'
    })
    tableHtml += '</tbody></table></div>'

    return tableHtml
  })
}
