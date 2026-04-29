/**
 * Generate composite clip thumbnails with the play button baked in.
 *
 *   pnpm email:composites
 *
 * Source priority per clip:
 *   1. cloudflare_stream_uid → pulls from CF Stream's animated.gif endpoint
 *   2. thumbnail_gif_url      → uses an arbitrary GIF URL
 *   3. thumbnail_url          → uses a static JPG URL (fallback)
 *
 * Outputs go to public/email-assets/composites/{filename}. When a clip has a
 * Stream uid, the featured composite becomes an animated GIF; static clips
 * stay as JPGs.
 *
 * Why composite at all: position:absolute play overlays are unreliable in
 * iOS Mail. Single composite images are what Wistia/Mux/Loom use —
 * bulletproof cross-client.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "email-assets", "composites");

interface Job {
  filename: string;
  sourceUrl: string;
  width: number;
  height: number;
  playSize: number;
  animated: boolean;
}

interface ClipLike {
  id?: string;
  cloudflare_stream_uid?: string;
  thumbnail_url?: string;
  thumbnail_gif_url?: string;
}

/**
 * Pick the best source for a clip:
 *   1. Cloudflare Stream `/thumbnails/thumbnail.gif` — gives us animation
 *   2. arbitrary `thumbnail_gif_url`
 *   3. `thumbnail_url` (JPG fallback)
 *
 * Returns { url, animated }.
 */
function pickSource(
  clip: ClipLike,
  forFeatured: boolean,
): { url: string; animated: boolean } {
  const subdomain = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_SUBDOMAIN;
  if (clip.cloudflare_stream_uid && subdomain) {
    const host = subdomain.includes(".") ? subdomain : `${subdomain}.cloudflarestream.com`;
    if (forFeatured) {
      // Stream's animated.gif endpoint — a 4s loop matching Wistia/Mux.
      return {
        url: `https://${host}/${clip.cloudflare_stream_uid}/thumbnails/thumbnail.gif?duration=4s&height=315`,
        animated: true,
      };
    }
    return {
      url: `https://${host}/${clip.cloudflare_stream_uid}/thumbnails/thumbnail.jpg?height=400&fit=crop`,
      animated: false,
    };
  }
  if (forFeatured && clip.thumbnail_gif_url) {
    return { url: clip.thumbnail_gif_url, animated: true };
  }
  if (clip.thumbnail_url) {
    return { url: clip.thumbnail_url, animated: false };
  }
  throw new Error("Clip has no usable source URL");
}

// The actual play icon path from src/components/submissions/VideoPlayer.tsx:735.
// viewBox `-1 0 16 18` — width ≈ 16, height ≈ 18.
const PLAY_ICON_PATH =
  "M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z";

function buildPlayBadgeSvg(circleSize: number): string {
  // Render the play icon via NESTED SVG with its native viewBox `-1 0 16 18`.
  // Nested-SVG + viewBox is more reliable than chained transforms in librsvg.
  const iconWidth = circleSize * 0.46;
  const iconHeight = iconWidth * (18 / 16);
  // Optical center — shift right so triangle's mass is centered.
  const iconX = (circleSize - iconWidth) / 2 + circleSize * 0.03;
  const iconY = (circleSize - iconHeight) / 2;

  // Solid white circle (no alpha) — GIF only supports 1-bit transparency, so
  // any semi-transparent fill blends with the animated background and the
  // badge disappears. Fully opaque keeps the button visibly punched on top.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${circleSize}" height="${circleSize}" viewBox="0 0 ${circleSize} ${circleSize}">
    <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${circleSize / 2 - 2}" fill="#FFFFFF"/>
    <svg x="${iconX}" y="${iconY}" width="${iconWidth}" height="${iconHeight}" viewBox="-1 0 16 18">
      <path d="${PLAY_ICON_PATH}" fill="#1A1A1A"/>
    </svg>
  </svg>`;
}

async function main() {
  const dataPath = path.join(ROOT, "emails", "data", "weekly-digest.json");
  const data = JSON.parse(await fs.readFile(dataPath, "utf8"));

  const featuredSource = pickSource(data.featured_clip as ClipLike, /* forFeatured */ true);
  const jobs: Job[] = [
    {
      filename: featuredSource.animated ? "featured.gif" : "featured.jpg",
      sourceUrl: featuredSource.url,
      // For animated GIFs target ~480px wide to keep file under 500KB.
      // Email displays at ~520-560px container so this is fine perceptually.
      width: featuredSource.animated ? 400 : 1120,
      height: featuredSource.animated ? 225 : 630,
      playSize: featuredSource.animated ? 64 : 144,
      animated: featuredSource.animated,
    },
    ...data.more_clips.map((c: ClipLike) => {
      const src = pickSource(c, /* forFeatured */ false);
      return {
        filename: `${c.id}.jpg`,
        sourceUrl: src.url,
        width: 320, // 2× of 160
        height: 400, // 2× of 200
        playSize: 84, // 2× of 42
        animated: false,
      };
    }),
  ];

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const job of jobs) {
    console.log(`[composite] ${job.filename} ← ${job.sourceUrl}`);

    const res = await fetch(job.sourceUrl);
    if (!res.ok) {
      console.error(`  failed to fetch source: ${res.status}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());

    const playBuffer = await sharp(Buffer.from(buildPlayBadgeSvg(job.playSize))).png().toBuffer();

    let outBuffer: Buffer;
    if (job.animated) {
      // Sharp treats animated input as one tall vertical tile (all frames
      // stacked). Build a single full-tile-sized PNG overlay with the play
      // badge stamped at every frame's center, then composite it once.
      const FRAMES = 16;
      const composites = [];
      for (let i = 0; i < FRAMES; i++) {
        composites.push({
          input: playBuffer,
          left: Math.round((job.width - job.playSize) / 2),
          top: Math.round(i * job.height + (job.height - job.playSize) / 2),
        });
      }
      const stampedOverlay = await sharp({
        create: {
          width: job.width,
          height: job.height * FRAMES,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite(composites)
        .png()
        .toBuffer();

      outBuffer = await sharp(buffer, { animated: true, pages: FRAMES })
        .resize(job.width, job.height, { fit: "cover", position: "centre" })
        .composite([{ input: stampedOverlay, top: 0, left: 0 }])
        .gif({ effort: 10, reuse: true, colours: 64, dither: 0.2 })
        .toBuffer();
    } else {
      outBuffer = await sharp(buffer)
        .resize(job.width, job.height, { fit: "cover", position: "centre" })
        .composite([{ input: playBuffer, gravity: "centre" }])
        .jpeg({ quality: 88, progressive: true })
        .toBuffer();
    }

    await fs.writeFile(path.join(OUT_DIR, job.filename), outBuffer);
    console.log(`  ✓ ${job.filename} ${(outBuffer.length / 1024).toFixed(1)} KB`);
  }

  console.log(`\n[composite] done. wrote ${jobs.length} files to ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
