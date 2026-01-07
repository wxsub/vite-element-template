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

export interface BreadcrumbItem {
  label: string
  link: string
  current: boolean
  _path: string
}

export interface BreadcrumbConfig {
  label: string
  link?: string | ((url: string) => string)
}