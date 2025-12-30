export interface Meta {
    hidden?: boolean;
    icon?: string;
    title?: string;
    layout?: string;
    roles?: string;
    middleware?: string | string[];
}

export interface RouterItem {
    path: string;
    component: string;
    meta?: Meta;
    children?: RouterItem[];
}

export interface RouterStore {
    options: RouterItem[];
}
