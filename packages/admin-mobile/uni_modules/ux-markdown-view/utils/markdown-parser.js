import {
  escapeHtml
} from './html-escape.js'

class MarkdownParser {
  constructor(options = {}) {
    this.options = {
      gfm: true,
      breaks: true,
      ...options
    }
    this.maxDepth = 10
  }

  parse(src) {
    if (!src) return ''
    src = src.replace(/\r\n|\r/g, '\n')
    return this.parseLines(src)
  }

  parseList(lines, startIndex, baseIndent) {
    let html = ''
    let i = startIndex
    let tag = null

    while (i < lines.length) {
      const line = lines[i]
      const match = line.match(/^([ ]*)([*+-]|\d+[.)])\s+(.*)$/)
      if (!match) break

      const indent = match[1].length
      const marker = match[2]
      const content = match[3]

      // 缩进回退，说明这一层结束
      if (indent < baseIndent) break

      const ordered = /\d/.test(marker)
      const currentTag = ordered ? 'ol' : 'ul'

      if (!tag) {
        tag = currentTag
        html += `<${tag}>`
      }

      // 新的列表类型，结束当前层
      if (tag !== currentTag) break

      i++
      let subHtml = ''

      // 向前看，是否有子列表
      if (i < lines.length) {
        const next = lines[i]
        const nextMatch = next.match(/^([ ]*)([*+-]|\d+[.)])\s+/)
        if (nextMatch && nextMatch[1].length > indent) {
          const result = this.parseList(lines, i, nextMatch[1].length)
          subHtml = result.html
          i = result.index
        }
      }

      html += `<li>${this.parseInline(content)}${subHtml}</li>`
    }

    if (tag) html += `</${tag}>`

    return {
      html,
      index: i
    }
  }

  parseLines(src) {
    let html = ''
    let inCodeBlock = false
    let codeBlockLang = ''
    let codeBlockContent = ''
    let codeBlockFence = ''
    const lines = src.split('\n')
    let i = 0
    let paragraphBuffer = ''

    const flushParagraph = () => {
      if (paragraphBuffer.trim()) {
        html += '<p>' + this.parseInline(paragraphBuffer.trim()) + '</p>'
        paragraphBuffer = ''
      }
    }

    while (i < lines.length) {
      const line = lines[i]

      if (inCodeBlock) {
        if (line.trim() === codeBlockFence) {
          html += '<pre><code' + (codeBlockLang ? ' class="language-' + codeBlockLang + '"' : '') + '>' + escapeHtml(
            codeBlockContent) + '</code></pre>'
          inCodeBlock = false
          codeBlockContent = ''
          codeBlockLang = ''
          codeBlockFence = ''
        } else {
          codeBlockContent += (codeBlockContent ? '\n' : '') + line
        }
        i++
        continue
      }

      const fenceMatch = line.match(/^(`{3,}|~{3,})(.*)$/)
      if (fenceMatch) {
        flushParagraph()
        inCodeBlock = true
        codeBlockFence = fenceMatch[1]
        codeBlockLang = fenceMatch[2].trim()
        codeBlockContent = ''
        i++
        continue
      }

      const headingMatch = line.match(/^(#{1,6})(.*)$/)
      if (headingMatch) {
        flushParagraph()
        const depth = headingMatch[1].length
        const text = headingMatch[2].replace(/^\s+/, '').replace(/\s+#+\s*$/, '').trim()
        html += '<h' + depth + '>' + this.parseInline(text) + '</h' + depth + '>'
        i++
        continue
      }

      const hrMatch = line.match(/^[ ]{0,3}([-*_])(?:[ ]*\1){2,}[ ]*$/)
      if (hrMatch) {
        flushParagraph()
        html += '<hr>'
        i++
        continue
      }

      if (i + 1 < lines.length && lines[i + 1].match(/^\|?[ ]*[-:]+[-| :]*$/)) {
        flushParagraph()
        const headerCells = line.split('|').map(c => c.trim()).filter(c => c !== '')
        const alignLine = lines[i + 1]
        const aligns = alignLine.split('|').map(c => c.trim()).filter(c => c !== '').map(c => {
          if (/^:-+:$/.test(c)) return 'center'
          if (/^-+:$/.test(c)) return 'right'
          if (/^:-+$/.test(c)) return 'left'
          return ''
        })
        html += '<div style="overflow-x: auto;"><table><thead><tr>'
        headerCells.forEach((cell, idx) => {
          const align = aligns[idx] ? ' style="text-align:' + aligns[idx] + '"' : ''
          html += '<th' + align + '>' + this.parseInline(cell, 0, 'table') + '</th>'
        })
        html += '</tr></thead><tbody>'
        i += 2
        while (i < lines.length && lines[i].includes('|')) {
          const cells = lines[i].split('|').map(c => c.trim()).filter(c => c !== '')
          html += '<tr>'
          cells.forEach((cell, idx) => {
            const align = aligns[idx] ? ' style="text-align:' + aligns[idx] + '"' : ''
            html += '<td' + align + '>' + this.parseInline(cell, 0, 'table') + '</td>'
          })
          html += '</tr>'
          i++
        }
        html += '</tbody></table></div>'
        continue
      }

      const listMatch = line.match(/^([ ]*)([*+-]|\d+[.)])\s+/)
      if (listMatch) {
        flushParagraph()
        const baseIndent = listMatch[1].length
        const result = this.parseList(lines, i, baseIndent)
        html += result.html
        i = result.index
        continue
      }

      const blockquoteMatch = line.match(/^[ ]{0,3}> ?(.*)$/)
      if (blockquoteMatch) {
        flushParagraph()
        let quoteContent = blockquoteMatch[1]
        i++
        while (i < lines.length) {
          const qMatch = lines[i].match(/^[ ]{0,3}> ?(.*)$/)
          if (!qMatch) break
          quoteContent += '\n' + qMatch[1]
          i++
        }
        html += '<blockquote>' + this.parseLines(quoteContent) + '</blockquote>'
        continue
      }

      if (line.trim() === '') {
        flushParagraph()
        i++
        continue
      }

      if (paragraphBuffer) {
        paragraphBuffer += '\n' + line
      } else {
        paragraphBuffer = line
      }
      i++
    }

    if (inCodeBlock) {
      html += '<pre><code' + (codeBlockLang ? ' class="language-' + codeBlockLang + '"' : '') + '>' + escapeHtml(
        codeBlockContent) + '</code></pre>'
    }

    flushParagraph()
    return html
  }

  // 检查是否为视频链接
  isVideoUrl(url) {
    if (!url) return false
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.avi', '.mkv', '.3gp']
    const lowerUrl = url.toLowerCase().split('?')[0] // 移除查询参数后判断
    return videoExtensions.some(ext => lowerUrl.endsWith(ext))
  }

  parseInline(src, depth = 0, context = 'normal') {
    if (!src) return ''
    if (depth > this.maxDepth) return escapeHtml(src)

    let html = ''
    let pos = 0

    while (pos < src.length) {
      let cap

      cap = src.slice(pos).match(/^!\[([^\]]*)\]\(([^)]+)\)/)
      if (cap) {
        html += '<img src="' + escapeHtml(cap[2]) + '" alt="' + escapeHtml(cap[1]) + '">'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^\[([^\]]*)\]\(([^)]+)\)/)
      if (cap) {
        const linkText = cap[1]
        const linkUrl = cap[2]
        // 如果是视频链接，渲染为 video 标签
        if (this.isVideoUrl(linkUrl)) {
          html += '<video src="' + escapeHtml(linkUrl) +
            '" controls style="width: 100%; border-radius: 10rpx; margin: 16rpx 0;">' + escapeHtml(linkText ||
              '您的浏览器不支持视频播放') + '</video>'
        } else {
          html += '<a href="' + escapeHtml(linkUrl) + '">' + this.parseInline(linkText, depth + 1) + '</a>'
        }
        pos += cap[0].length
        continue
      }

      // 识别纯视频URL (http:// 或 https:// 开头，以视频扩展名结尾)
      cap = src.slice(pos).match(
        /^(https?:\/\/[^\s<>"]+\.(mp4|webm|ogg|mov|m4v|avi|mkv|3gp)(\?[^\s<>"]*)?)(?=[\s<>"]|$)/i)
      if (cap) {
        const videoUrl = cap[1]
        html += '<video src="' + escapeHtml(videoUrl) +
          '" controls style="width: 100%; border-radius: 10rpx; margin: 16rpx auto;">您的浏览器不支持视频播放</video>'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^`([^`]+)`/)
      if (cap) {
        html += '<code>' + escapeHtml(cap[1]) + '</code>'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^\*\*(.+?)\*\*/)
      if (cap) {
        html += '<strong>' + this.parseInline(cap[1], depth + 1) + '</strong>'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^__(.+?)__/)
      if (cap) {
        html += '<strong>' + this.parseInline(cap[1], depth + 1) + '</strong>'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^\*(.+?)\*/)
      if (cap) {
        html += '<em>' + this.parseInline(cap[1], depth + 1) + '</em>'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^_(.+?)_/)
      if (cap) {
        html += '<em>' + this.parseInline(cap[1], depth + 1) + '</em>'
        pos += cap[0].length
        continue
      }

      cap = src.slice(pos).match(/^~~(.+?)~~/)
      if (cap) {
        html += '<del>' + this.parseInline(cap[1], depth + 1) + '</del>'
        pos += cap[0].length
        continue
      }

      if (src[pos] === '\n') {
        if (context === 'table') {
          html += ' ' // 表格里：换行当空格
        } else {
          html += '<br>'
        }
        pos++
        continue
      }

      html += escapeHtml(src[pos])
      pos++
    }

    return html
  }
}

export function parseMarkdown(src, options) {
  const parser = new MarkdownParser(options)
  return parser.parse(src)
}

export {
  MarkdownParser
}
