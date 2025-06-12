import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import defaultSettings from "@/config/setting";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

export const useAppStore = defineStore("app", () => {
  const language = useStorage("language", defaultSettings.language),
    size = useStorage<any>("size", defaultSettings.size),
    sidebarStatus = useStorage("sidebarStatus", "closed");

  const sidebar = reactive({
    opened: sidebarStatus.value === "opened",
    withoutAnimation: false,
  });

  const locale = computed(() => {
    if (language?.value == "en") {
      return en;
    } else {
      return zhCn;
    }
  })

  // Change language
  function changeLanguage(val: string) {
    language.value = val;
  }

  function toggleSidebar() {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = false;
    if (sidebar.opened) {
      sidebarStatus.value = "opened";
    } else {
      sidebarStatus.value = "closed";
    }
  }

  function closeSideBar(withoutAnimation: boolean) {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
    sidebarStatus.value = "closed";
  }

  function openSideBar(withoutAnimation: boolean) {
    sidebar.opened = true;
    sidebar.withoutAnimation = withoutAnimation;
    sidebarStatus.value = "opened";
  }

  function changeSize(val: string) {
    size.value = val;
  }

  return {
    sidebar,
    locale,
    changeLanguage,
    toggleSidebar,
    closeSideBar,
    openSideBar,
    size,
    changeSize
  };
});
