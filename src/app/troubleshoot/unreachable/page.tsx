import type { Metadata } from "next";
import Workflow from "./workflow";

export const metadata: Metadata = {
  title: "Website / Server Unreachable — Troubleshoot DNS to TLS",
  description: "Step-by-step diagnosis for unreachable websites: DNS, ping, TCP 443, HTTP and TLS with plain-English explanations.",
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <Workflow />
    </div>
  );
}
