import { ElMessage } from "element-plus";
import type { Directive } from "vue";

type CopyTextEl = HTMLElement & {
  __copyTextIcon?: HTMLElement;
  __copyTextHandler?: () => void;
};

const copyTextDirective: Directive<CopyTextEl> = {
  mounted(el, binding: any = {}) {
    const icon = document.createElement("i");
    const { value, arg } = binding;

    icon.className = "el-icon-copy-document";
    icon.style.cursor = "pointer";
    if (arg && value) icon.style[arg] = value;
    icon.setAttribute("title", "复制文本");

    el.insertBefore(icon, el.nextSibling);

    const handler = async () => {
      const text = el.textContent || el.innerText || "";
      await copyText(text, "已复制");
    };

    icon.addEventListener("click", handler);

    el.__copyTextIcon = icon;
    el.__copyTextHandler = handler;
  },
  unmounted(el) {
    const icon = el.__copyTextIcon;
    const handler = el.__copyTextHandler;
    if (icon && handler) icon.removeEventListener("click", handler);
    icon?.remove();
    delete el.__copyTextIcon;
    delete el.__copyTextHandler;
  }
};

export default copyTextDirective;

export const copyText = async (val: string, tips: string | null = null) => {
  try {
    const inputElement = document.createElement("input");
    inputElement.value = val.trim();
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand("copy");
    document.body.removeChild(inputElement);
    if (tips) ElMessage.success(tips);
  } catch (error) {
    console.log(`${error}`);
    return "";
  }
};
