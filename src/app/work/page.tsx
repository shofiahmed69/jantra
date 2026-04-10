import { Metadata } from "next";
import WorkClient from "./WorkClient";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Browse Jantra's portfolio of custom software, enterprise AI agents, and high-end web applications shipped for industry leaders.",
};

export default function Page() {
  return <WorkClient />;
}
