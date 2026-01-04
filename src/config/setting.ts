interface DefaultSettings {
    title: string;  // system title
    header: string,
    aside: string,
    language: "zh-cn" | "en",  // language, default is en
    layout: string;
    size: "default" | "small" | "medium" | "large";  // ElementPlus Components Layout size
    themeColor: string;
    tagsView: boolean;
    showSettings: boolean;
    fixedHeader: boolean;
    sidebarLogo: boolean;
}

const defaultSettings: DefaultSettings = {
    title: "vite-element-template",
    header: "60px",
    aside: "200px",
    language: "en",  // default language, you can set more languages in the app store
    layout: "left",
    size: "default",
    themeColor: "#409EFF",
    tagsView: true,
    showSettings: true,
    fixedHeader: true,
    sidebarLogo: true
};

export default defaultSettings
