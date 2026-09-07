import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
    );
  }
} else if (!apiHost) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
    );
  }
} else {
  // Use local proxy (/ingest) to avoid adblockers / CORS blocking direct us.i.posthog.com.
  // NEXT_PUBLIC_POSTHOG_HOST is kept as https://us.i.posthog.com for ui_host / reference,
  // but api traffic goes via same-origin rewrites in next.config.ts.
  const isPosthogHost = /posthog\.com/i.test(apiHost);
  posthog.init(projectToken, {
    api_host: isPosthogHost ? "/ingest" : apiHost,
    ui_host: isPosthogHost ? "https://us.posthog.com" : undefined,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}
