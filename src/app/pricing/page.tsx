import React from "react";
import PricingClient from "./PricingClient";
import api from "@/lib/api";

export const revalidate = 300; // Cache pricing page for 5 minutes (Incremental Static Regeneration)

const FALLBACK_SERVICES = [
    {
        id: "fallback-1",
        title: "Custom Software Development",
        slug: "custom-software-development",
        description: "Business systems, internal tools, and client platforms built to scale cleanly.",
        features: ["UI/UX Design", "Responsive Frontend", "Core REST APIs"],
        techStack: ["React", "Next.js"],
        priceMinUsd: 5000,
        priceMaxUsd: 25000,
        priceMinEur: 4500,
        priceMaxEur: 23000,
        priceMinBdt: 500000,
        priceMaxBdt: 2500000,
        priceMin: 5000,
        priceMax: 25000,
        published: true
    },
    {
        id: "fallback-2",
        title: "AI Agent Development",
        slug: "ai-agent-development",
        description: "Custom virtual assistants, data extraction tools, and decision-support systems.",
        features: ["Custom AI Models", "Search Systems", "AI Chat Integration"],
        techStack: ["Python", "OpenAI"],
        priceMinUsd: 8000,
        priceMaxUsd: 35000,
        priceMinEur: 7500,
        priceMaxEur: 32000,
        priceMinBdt: 800000,
        priceMaxBdt: 3500000,
        priceMin: 8000,
        priceMax: 35000,
        published: true
    },
    {
        id: "fallback-3",
        title: "Workflow Automation",
        slug: "workflow-automation",
        description: "Automatic data transfer and task synchronization across your business software.",
        features: ["System Integration", "Automatic Alerts", "Data Syncing"],
        techStack: ["Make.com", "n8n"],
        priceMinUsd: 3000,
        priceMaxUsd: 12000,
        priceMinEur: 2800,
        priceMaxEur: 11000,
        priceMinBdt: 300000,
        priceMaxBdt: 1200000,
        priceMin: 3000,
        priceMax: 12000,
        published: true
    },
    {
        id: "fallback-4",
        title: "SaaS Product Development",
        slug: "saas-product-development",
        description: "Subscription-based web applications with user dashboards and automated billing.",
        features: ["Secure Login", "Subscription Billing", "User Dashboards"],
        techStack: ["Next.js", "Stripe"],
        priceMinUsd: 15000,
        priceMaxUsd: 60000,
        priceMinEur: 14000,
        priceMaxEur: 55000,
        priceMinBdt: 1500000,
        priceMaxBdt: 6000000,
        priceMin: 15000,
        priceMax: 60000,
        published: true
    },
    {
        id: "fallback-5",
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "Bespoke mobile applications for iOS and Android with offline capability.",
        features: ["iOS & Android Apps", "Offline Support", "Push Notifications"],
        techStack: ["React Native", "Expo"],
        priceMinUsd: 10000,
        priceMaxUsd: 30000,
        priceMinEur: 9000,
        priceMaxEur: 28000,
        priceMinBdt: 1000000,
        priceMaxBdt: 3000000,
        priceMin: 10000,
        priceMax: 30000,
        published: true
    },
    {
        id: "fallback-6",
        title: "Cloud & API Systems",
        slug: "cloud-api-systems",
        description: "Secure backend databases and custom APIs connecting your platforms and external services.",
        features: ["Cloud Hosting", "Custom APIs", "Secure Databases"],
        techStack: ["AWS", "Docker"],
        priceMinUsd: 6000,
        priceMaxUsd: 20000,
        priceMinEur: 5500,
        priceMaxEur: 18000,
        priceMinBdt: 600000,
        priceMaxBdt: 2000000,
        priceMin: 6000,
        priceMax: 20000,
        published: true
    }
];

async function getServices() {
    try {
        const response = await api.get("/services");
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data) && data.length > 0) {
            return data;
        }
    } catch (error) {
        console.error("Failed to fetch services for pricing page server-side:", error);
    }
    return FALLBACK_SERVICES;
}

export default async function PricingPage() {
    const initialServices = await getServices();
    return <PricingClient initialServices={initialServices} />;
}
