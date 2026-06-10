export function objectMove(
  obj: Record<string, number>,
  from: number,
  to: number
): Record<string, number> {
  'worklet';
  const out: Record<string, number> = {};
  for (const id in obj) {
    const p = obj[id];
    if (p === from) out[id] = to;
    else if (from < to && p > from && p <= to) out[id] = p - 1;
    else if (from > to && p >= to && p < from) out[id] = p + 1;
    else out[id] = p;
  }
  return out;
}

export const clamp = (v: number, min: number, max: number) => {
  'worklet';
  return Math.max(min, Math.min(max, v));
};

let hapticModule: any = null;
try {
  hapticModule = require('react-native-haptic-feedback');
} catch {}

export const haptic = (type: string, enabled: boolean) => {
  if (!enabled || !hapticModule) return;
  const trigger = hapticModule.default?.trigger ?? hapticModule.trigger;
  trigger?.(type, {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
};
