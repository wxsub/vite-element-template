export interface Meta {
    hidden?: boolean;
    icon?: string;
    title?: string;
}

export interface SidebarItem {
    path: string;
    meta?: Meta;
    children?: SidebarItem[];
}

export interface RouterStore {
    options: SidebarItem[];
}
