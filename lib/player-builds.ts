import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import type { Readable } from "node:stream";
import { getS3ObjectStream } from "@/lib/s3";

export type PlayerArch = "x64" | "arm64";
export type PlayerPlatformKey = "LINUX" | "WINDOWS";

export const DEFAULT_ARCH_BY_PLATFORM: Record<PlayerPlatformKey, PlayerArch> = {
  WINDOWS: "x64",
  LINUX: "x64",
};

/** Architectures each platform build actually produces. */
export const SUPPORTED_ARCHS: Record<PlayerPlatformKey, PlayerArch[]> = {
  WINDOWS: ["x64"],
  LINUX: ["x64", "arm64"],
};

export function playerBuildVersion() {
  // CMS downloads always resolve through this stable release channel. The
  // publisher updates player-builds/latest alongside each numbered release.
  return process.env.PLAYER_BUILD_VERSION || "latest";
}

export function parseArch(value: unknown, platform: PlayerPlatformKey): PlayerArch | null {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_ARCH_BY_PLATFORM[platform];
  }
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase() as PlayerArch;
  return SUPPORTED_ARCHS[platform].includes(normalized) ? normalized : null;
}

/**
 * electron-builder expands `${arch}` to the GNU triplet name for AppImage
 * targets, so x64 becomes "x86_64" while arm64 stays "arm64". This table must
 * match `linux.artifactName` in the player repo's package.json.
 */
const APPIMAGE_ARCH_SUFFIX: Record<PlayerArch, string> = {
  x64: "x86_64",
  arm64: "arm64",
};

/**
 * Artifact names mirror `electron-builder` output in the player repo:
 *   npm run build:windows -> output/windows/reds-player.exe
 *   npm run build:linux   -> output/linux/reds-player-x86_64.AppImage
 *                            output/linux/reds-player-arm64.AppImage
 */
export function artifactFilename(platform: PlayerPlatformKey, arch: PlayerArch) {
  return platform === "WINDOWS"
    ? "reds-player.exe"
    : `reds-player-${APPIMAGE_ARCH_SUFFIX[arch]}.AppImage`;
}

function artifactSubdir(platform: PlayerPlatformKey) {
  return platform === "WINDOWS" ? "windows" : "linux";
}

export function artifactS3Key(platform: PlayerPlatformKey, arch: PlayerArch, version = playerBuildVersion()) {
  return `player-builds/${version}/${artifactSubdir(platform)}/${artifactFilename(platform, arch)}`;
}

export interface PlayerArtifact {
  filename: string;
  size: number | null;
  open: () => Promise<Readable>;
}

/**
 * Resolves the installer for a platform/arch. `PLAYER_BINARY_DIR` points at the
 * player repo's `output/` folder for local development; otherwise the artifact
 * is streamed from the S3 release prefix.
 */
export async function resolvePlayerArtifact(
  platform: PlayerPlatformKey,
  arch: PlayerArch,
): Promise<PlayerArtifact> {
  const filename = artifactFilename(platform, arch);
  const localDir = process.env.PLAYER_BINARY_DIR;

  if (localDir) {
    const localPath = path.join(localDir, artifactSubdir(platform), filename);
    const stats = await stat(localPath).catch(() => null);
    if (!stats?.isFile()) {
      throw new Error(
        `Player build not found at ${localPath}. Run "npm run build:${platform.toLowerCase()}" in the player repo.`,
      );
    }
    return { filename, size: stats.size, open: async () => createReadStream(localPath) };
  }

  const key = artifactS3Key(platform, arch);
  const head = await getS3ObjectStream(key).catch(() => null);
  if (!head) {
    throw new Error(`Player build ${key} is not published. Run "npm run publish:player-build".`);
  }

  return {
    filename,
    size: head.contentLength,
    // The head request already opened a stream; reuse it rather than re-fetching.
    open: async () => head.body as Readable,
  };
}
