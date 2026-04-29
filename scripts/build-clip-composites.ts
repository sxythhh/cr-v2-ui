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
}

async function main() {
  const dataPath = path.join(ROOT, "emails", "data", "weekly-digest.json");
  const data = JSON.parse(await fs.readFile(dataPath, "utf8"));

  const jobs: Job[] = [
    {
      filename: "featured.jpg",
      sourceUrl: data.featured_clip.thumbnail_url,
      width: 1040, // 2× of 520
      height: 585, // 2× of 292
      playSize: 128, // 2× of 64
    },
    ...data.more_clips.map((c: { id: string; thumbnail_url: string }) => ({
      filename: `${c.id}.jpg`,
      sourceUrl: c.thumbnail_url,
      width: 320, // 2× of 160
      height: 400, // 2× of 200
      playSize: 84, // 2× of 42
    })),
  ];

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const job of jobs) {
    console.log(`[composite] ${job.filename} ← ${job.sourceUrl}`);

    // Download source
    const res = await fetch(job.sourceUrl);
    if (!res.ok) {
      console.error(`  failed to fetch source: ${res.status}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());

    // Build the play button as an SVG (vector → sharp rasterizes crisply)
    const c = job.playSize / 2; // center
    const triSize = job.playSize * 0.42; // triangle size relative to circle
    const triOffsetX = job.playSize * 0.04; // visual centering offset
    const playSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${job.playSize}" height="${job.playSize}" viewBox="0 0 ${job.playSize} ${job.playSize}">
        <defs>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="${job.playSize * 0.04}" />
            <feOffset dx="0" dy="${job.playSize * 0.06}" result="offsetblur"/>
            <feFlood flood-color="#000" flood-opacity="0.35"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="${c}" cy="${c}" r="${c - 2}" fill="#FFFFFF" fill-opacity="0.96" filter="url(#shadow)"/>
        <path d="M ${c - triSize / 2 + triOffsetX} ${c - triSize * 0.55} L ${c + triSize / 2 + triOffsetX} ${c} L ${c - triSize / 2 + triOffsetX} ${c + triSize * 0.55} Z" fill="#1A1A1A"/>
      </svg>
    `;
    const playBuffer = await sharp(Buffer.from(playSvg)).png().toBuffer();

    // Composite: resize source to target, then overlay play centered
    const outBuffer = await sharp(buffer)
      .resize(job.width, job.height, { fit: "cover", position: "centre" })
      .composite([
        {
          input: playBuffer,
          gravity: "centre",
        },
      ])
      .jpeg({ quality: 88, progressive: true })
      .toBuffer();

    await fs.writeFile(path.join(OUT_DIR, job.filename), outBuffer);
    console.log(`  ✓ ${job.filename} ${(outBuffer.length / 1024).toFixed(1)} KB`);
  }

  console.log(`\n[composite] done. wrote ${jobs.length} files to ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
