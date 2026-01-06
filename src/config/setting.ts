interface DefaultSettings {
    title: string;  // system title
    header: string,
    aside: string,
    showSidebar: boolean,
    language: "zh-cn" | "en",  // language, default is en
    size: "default" | "small" | "medium" | "large";  // ElementPlus Components Layout size
    tagsView: boolean;
    showSettings: boolean;
    fixedHeader: boolean;
    sidebarLogo: boolean;
}

const defaultSettings: DefaultSettings = {
    title: "vite-element-template",
    header: "60px",
    aside: "200px",
    showSidebar: true,
    language: "en",  // default language, you can set more languages in the app store
    size: "default",
    tagsView: true,
    showSettings: true,
    fixedHeader: true,
    sidebarLogo: true
};

export default defaultSettings
