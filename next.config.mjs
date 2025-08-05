import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/packages/next-on-pages/docs/api/next-dev.md
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}
