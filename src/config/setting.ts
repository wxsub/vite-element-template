interface DefaultSettings {
    title: string;  // system title
    header: string,
    aside: string,
    layout: string;
    size: string;  // 布局大小(default |large |small)
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
