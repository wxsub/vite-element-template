import type { App, Directive } from "vue";

type DirectiveModule = { default?: Directive | undefined } & Record<string, unknown>;

const folderDirectiveModules = import.meta.glob<DirectiveModule>("./modules/*/index.{ts,js}", {
  eager: true
});

const fileDirectiveModules = import.meta.glob<DirectiveModule>("./modules/*.{ts,js}", { eager: true });

function registerDirective(app: App<Element>, name: string, mod: DirectiveModule) {
  const directive = (mod.default ?? undefined) as Directive | undefined;
  if (!directive) return;
  app.directive(name, directive);
}

export function setupDirective(app: App<Element>) {
  const registeredNames = new Set<string>();

  for (const [path, mod] of Object.entries(folderDirectiveModules)) {
    const match = path.match(/^\.\/modules\/([^/]+)\/index\.(?:ts|js)$/);
    const name = match?.[1];
    if (!name || registeredNames.has(name)) continue;
    registerDirective(app, name, mod);
    registeredNames.add(name);
  }

  for (const [path, mod] of Object.entries(fileDirectiveModules)) {
    const match = path.match(/^\.\/modules\/([^/]+)\.(?:ts|js)$/);
    const name = match?.[1];
    if (!name || registeredNames.has(name)) continue;
    registerDirective(app, name, mod);
    registeredNames.add(name);
  }
}
