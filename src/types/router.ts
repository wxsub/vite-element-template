export interface Meta {
    hidden?: boolean;
    icon?: string;
    title?: string;
    layout?: string;
    permission?: number | bigint;
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
