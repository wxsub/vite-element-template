interface DefaultSettings {
    title: string;  // system title
    headerHeight: number,
    layout: string;
    size: string;  // 布局大小(default |large |small)
    themeColor: string;
}

const defaultSettings: DefaultSettings = {
    title: "wxsub-admin-vite",
    headerHeight: 60,
    layout: "left",
    size: "default",
    themeColor: "#409EFF"
};

export default defaultSettings
