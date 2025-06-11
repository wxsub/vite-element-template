interface DefaultSettings {
    title: string;  // system title
    header: string,
    aside: string,
    layout: string;
    size: "default" | "small" | "medium" | "large";  // ElementPlus Components Layout size
    themeColor: string;
}

const defaultSettings: DefaultSettings = {
    title: "vite-element-template",
    header: "60px",
    aside: "200px",
    layout: "left",
    size: "default",
    themeColor: "#409EFF"
};

export default defaultSettings
