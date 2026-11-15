import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default async function configurarNext(phase: string): Promise<NextConfig> {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    await initOpenNextCloudflareForDev();
  }

  return {
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}