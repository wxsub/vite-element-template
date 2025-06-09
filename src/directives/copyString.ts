import { ElMessage } from 'element-plus'
/**
 * v-copy-text
 */
export default {
  bind: (el: any, binding: any = {}) => {
    const icon = document.createElement('i'),
      { value, arg } = binding;
    icon.className = 'el-icon-copy-document'
    icon.style.cursor = 'pointer'
    if (arg && value) icon.style[arg] = value
    icon.setAttribute('title', '复制文本')
    el.insertBefore(icon, el.nextSibling)
    icon.addEventListener('click', async () => {
      const text = el.textContent || el.innerText
      await copyText(text, '已复制')
    })
  }
}

export const copyText = async (val: string, tips: string | null = null) => {
  try {
    const inputElement = document.createElement('input')
    inputElement.value = val.trim()
    document.body.appendChild(inputElement)
    inputElement.select()
    document.execCommand('copy')
    document.body.removeChild(inputElement)
    if (tips) ElMessage.success(tips)
  } catch (error) {
    console.log(`${error}`);
    return ''
  }
}