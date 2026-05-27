/**
 * HTML 转义工具
 */
export function escapeHtml(text) {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    switch (text[i]) {
      case '&':
        result += '&amp;';
        break;
      case '<':
        result += '&lt;';
        break;
      case '>':
        result += '&gt;';
        break;
      case '"':
        result += '&quot;';
        break;
      case "'":
        result += '&#39;';
        break;
      default:
        result += text[i];
    }
  }
  return result;
}

export function unescapeHtml(text) {
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  }
  return text.replace(/&(amp|lt|gt|quot|#039);/g, function(m) {
    return map[m]
  })
}
