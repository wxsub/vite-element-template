import { defineStore } from "pinia";
import defaultSettings from "@/config/setting";

export const useSettingsStore = defineStore("setting", () => {
  // state
  const showSidebar = useStorage<boolean>("showSidebar", defaultSettings.showSidebar);

  const showSettings = ref<boolean>(defaultSettings.showSettings);
  const sidebarLogo = ref<boolean>(defaultSettings.sidebarLogo);

  const fixedHeader = useStorage<boolean>(
    "fixedHeader",
    defaultSettings.fixedHeader
  );

  // actions
  function changeSetting(param: { key: string; value: any }) {
    const { key, value } = param;
    switch (key) {
      case "showSettings":
        showSettings.value = value;
        break;
      case "fixedHeader":
        fixedHeader.value = value;
        break;
      case "showSidebar":
        showSidebar.value = value;
        break;
      case "sidevarLogo":
        sidebarLogo.value = value;
        break;
    }
  }

  return {
    showSettings,
    showSidebar,
    fixedHeader,
    sidebarLogo,
    changeSetting
  };
});
