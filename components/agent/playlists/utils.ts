import { CompatResult, DisplayProfile, Fit } from "./types";

export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export function aspectRatioLabel(w: number, h: number): string {
  if (!w || !h) return "—";
  const g = gcd(w, h);
  const aw = w / g;
  const ah = h / g;
  if (aw > 40 || ah > 40) return (w / h).toFixed(2) + ":1";
  return `${aw}:${ah}`;
}

export function formatDuration(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

interface CompatAsset {
  type: string;
  w: number;
  h: number;
  fit?: Fit;
}

export function getCompatibility(asset: CompatAsset, disp: DisplayProfile): CompatResult {
  if (asset.type === "HTML5" || !asset.w) {
    return {
      level: "ok",
      icon: "✅",
      short: "PERFECT FIT",
      label: "Perfect Fit",
      tip: "HTML5 content is responsive and adapts to any display resolution.",
    };
  }

  const aAR = asset.w / asset.h;
  const dAR = disp.w / disp.h;
  const sameAR = Math.abs(aAR - dAR) < 0.02;
  const assetPortrait = asset.h > asset.w;
  const dispLandscape = disp.w >= disp.h;

  if (sameAR) {
    if (asset.w === disp.w && asset.h === disp.h) {
      return {
        level: "ok",
        icon: "✅",
        short: "PERFECT FIT",
        label: "Perfect Fit",
        tip: `Native ${asset.w}×${asset.h} — matches the display exactly.`,
      };
    }
    if (asset.w < disp.w * 0.6) {
      return {
        level: "warn",
        icon: "⚠",
        short: "LOW RES",
        label: "Low Resolution",
        tip: `This asset is ${asset.w}×${asset.h} and will look soft when upscaled to ${disp.w}×${disp.h}.`,
      };
    }
    if (asset.w < disp.w) {
      return {
        level: "warn",
        icon: "⚠",
        short: "UPSCALE",
        label: "Upscaling Required",
        tip: `This asset is ${asset.w}×${asset.h} and will be upscaled to ${disp.w}×${disp.h}.`,
      };
    }
    return {
      level: "ok",
      icon: "✅",
      short: "PERFECT FIT",
      label: "Perfect Fit",
      tip: "Higher resolution than the display — will be downscaled cleanly.",
    };
  }

  if (assetPortrait && dispLandscape) {
    return {
      level: "warn",
      icon: "⚠",
      short: "PORTRAIT",
      label: "Portrait asset in Landscape playlist",
      tip: `This asset is ${asset.w}×${asset.h} and will be ${
        asset.fit === "Fill" ? "center-cropped" : "letterboxed with black bars"
      } on a ${disp.w}×${disp.h} display.`,
    };
  }

  return {
    level: "warn",
    icon: "⚠",
    short: "AR MISMATCH",
    label: "Aspect Ratio Mismatch",
    tip: `${aspectRatioLabel(asset.w, asset.h)} asset on a ${aspectRatioLabel(disp.w, disp.h)} display — expect ${
      asset.fit === "Fill" ? "cropping" : "black bars"
    }.`,
  };
}
