import type { Directive } from "vue";

type CalculateAgeOptions =
  | string
  | {
      birthDateStr?: string;
      invalidText?: string | null;
      suffix?: string;
    };

const calculateAge = (birthDateStr?: string): number => {
  const birthDate = birthDateStr ? new Date(birthDateStr) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime()) || birthDate > new Date()) return -1;

  const [by, bm, bd] = [birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()];
  const now = new Date();
  const [cy, cm, cd] = [now.getFullYear(), now.getMonth(), now.getDate()];

  return cy - by - (cm < bm || (cm === bm && cd < bd) ? 1 : 0);
};

type AgeEl = (HTMLElement | HTMLInputElement | HTMLTextAreaElement) & {
  __calculateAgeDefaultSuffix?: string;
  __calculateAgeLastRendered?: string;
};

function setAgeText(el: AgeEl, text: string) {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = text;
    el.__calculateAgeLastRendered = text;
    return;
  }
  el.textContent = text;
  el.__calculateAgeLastRendered = text;
}

function readDisplayedText(el: AgeEl): string {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value ?? "" : el.textContent ?? "";
}

function readDefaultSuffix(el: AgeEl): string {
  if (el.__calculateAgeDefaultSuffix !== undefined) return el.__calculateAgeDefaultSuffix;

  const suffix = readDisplayedText(el);
  el.__calculateAgeDefaultSuffix = suffix;
  return suffix;
}

function refreshDefaultSuffixIfNeeded(el: AgeEl) {
  const displayedText = readDisplayedText(el);
  if (displayedText !== el.__calculateAgeLastRendered) {
    el.__calculateAgeDefaultSuffix = displayedText;
  }
}

function resolveOptions(
  value: CalculateAgeOptions | undefined
): { birthDateStr?: string; invalidText?: string | null; suffix?: string } {
  if (typeof value === "string" || value == null) {
    return { birthDateStr: value, invalidText: undefined, suffix: undefined };
  }
  return value;
}

function update(el: AgeEl, value: CalculateAgeOptions | undefined) {
  const options = resolveOptions(value);
  const age = calculateAge(options.birthDateStr);

  if (age === -1) {
    const invalidText = options.invalidText === undefined ? "-" : options.invalidText ?? "";
    setAgeText(el, invalidText);
    return;
  }

  if (options.suffix === undefined) refreshDefaultSuffixIfNeeded(el);
  const suffix = options.suffix ?? readDefaultSuffix(el);
  setAgeText(el, `${age}${suffix}`);
}

const calculateAgeDirective: Directive<AgeEl, CalculateAgeOptions> = {
  mounted(el, binding) {
    readDefaultSuffix(el);
    update(el, binding.value);
  },
  updated(el, binding) {
    update(el, binding.value);
  }
};

export default calculateAgeDirective;
