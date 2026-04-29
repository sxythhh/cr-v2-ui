/**
 * Generate composite clip thumbnails with the play button baked in.
 *
 *   pnpm email:composites
 *
 * Reads emails/data/weekly-digest.json, downloads each clip's source image,
 * composites a 64px white circle + dark play triangle in the center, and
 * writes JPGs to public/email-assets/composites/.
 *
 * The output filenames are: featured.jpg, c1.jpg, c2.jpg, c3.jpg.
 *
 * Why: position:absolute play overlays are unreliable in iOS Mail. Single
 * composite images are what Wistia/Mux/Loom use — bulletproof cross-client.
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

// The actual play icon path from src/components/submissions/VideoPlayer.tsx:735.
// viewBox `-1 0 16 18` — width ≈ 16, height ≈ 18.
const PLAY_ICON_PATH =
  "M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z";

function buildPlayBadgeSvg(circleSize: number): string {
  // Path is in a 16-wide × 18-tall coord system (viewBox `-1 0 16 18`).
  // Render the icon at ~42% of circle diameter, optically centered.
  const targetIconWidth = circleSize * 0.42;
  const scale = targetIconWidth / 16;
  const iconWidth = 16 * scale;
  const iconHeight = 18 * scale;
  // Optical center: shift right slightly so the triangle's mass looks centered.
  const x = (circleSize - iconWidth) / 2 + circleSize * 0.025;
  const y = (circleSize - iconHeight) / 2;
  const shadowBlur = circleSize * 0.04;
  const shadowOffsetY = circleSize * 0.06;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${circleSize}" height="${circleSize}" viewBox="0 0 ${circleSize} ${circleSize}">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="${shadowBlur}" />
        <feOffset dx="0" dy="${shadowOffsetY}" result="offsetblur"/>
        <feFlood flood-color="#000" flood-opacity="0.35"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${circleSize / 2 - 2}" fill="#FFFFFF" fill-opacity="0.96" filter="url(#shadow)"/>
    <g transform="translate(${x} ${y}) scale(${scale}) translate(1 0)">
      <path d="${PLAY_ICON_PATH}" fill="#1A1A1A"/>
    </g>
  </svg>`;
}

async function main() {
  const dataPath = path.join(ROOT, "emails", "data", "weekly-digest.json");
  const data = JSON.parse(await fs.readFile(dataPath, "utf8"));

  const jobs: Job[] = [
    {
      filename: "featured.gif",
      sourceUrl: data.featured_clip.thumbnail_gif_url ?? data.featured_clip.thumbnail_url,
      // Animated GIFs balloon if upscaled 2× — keep at display size.
      width: 560,
      height: 315,
      playSize: 80,
      animated: true,
    },
    ...data.more_clips.map((c: { id: string; thumbnail_url: string }) => ({
      filename: `${c.id}.jpg`,
      sourceUrl: c.thumbnail_url,
      width: 320, // 2× of 160
      height: 400, // 2× of 200
      playSize: 84, // 2× of 42
      animated: false,
    })),
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
      // Animated input → per-frame composite → animated output.
      // Sharp v0.34+ handles animated GIF input with { animated: true } and
      // composites the overlay onto every frame automatically.
      outBuffer = await sharp(buffer, { animated: true })
        .resize(job.width, job.height, { fit: "cover", position: "centre" })
        .composite([{ input: playBuffer, gravity: "centre" }])
        .gif({ effort: 10, reuse: true, colours: 96 })
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
