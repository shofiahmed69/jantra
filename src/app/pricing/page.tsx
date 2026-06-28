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
        priceMinUsd: 290,
        priceMaxUsd: 1450,
        priceMinEur: 270,
        priceMaxEur: 1350,
        priceMinBdt: 30000,
        priceMaxBdt: 150000,
        priceMin: 290,
        priceMax: 1450,
        published: true
    },
    {
        id: "fallback-2",
        title: "AI Agent Development",
        slug: "ai-agent-development",
        description: "Custom virtual assistants, data extraction tools, and decision-support systems.",
        features: ["Custom AI Models", "Search Systems", "AI Chat Integration"],
        techStack: ["Python", "OpenAI"],
        priceMinUsd: 390,
        priceMaxUsd: 2450,
        priceMinEur: 360,
        priceMaxEur: 2250,
        priceMinBdt: 40000,
        priceMaxBdt: 250000,
        priceMin: 390,
        priceMax: 2450,
        published: true
    },
    {
        id: "fallback-3",
        title: "Workflow Automation",
        slug: "workflow-automation",
        description: "Automatic data transfer and task synchronization across your business software.",
        features: ["System Integration", "Automatic Alerts", "Data Syncing"],
        techStack: ["Make.com", "n8n"],
        priceMinUsd: 149,
        priceMaxUsd: 790,
        priceMinEur: 135,
        priceMaxEur: 730,
        priceMinBdt: 15000,
        priceMaxBdt: 80000,
        priceMin: 149,
        priceMax: 790,
        published: true
    },
    {
        id: "fallback-4",
        title: "SaaS Product Development",
        slug: "saas-product-development",
        description: "Subscription-based web applications with user dashboards and automated billing.",
        features: ["Secure Login", "Subscription Billing", "User Dashboards"],
        techStack: ["Next.js", "Stripe"],
        priceMinUsd: 790,
        priceMaxUsd: 4450,
        priceMinEur: 730,
        priceMaxEur: 4150,
        priceMinBdt: 80000,
        priceMaxBdt: 450000,
        priceMin: 790,
        priceMax: 4450,
        published: true
    },
    {
        id: "fallback-5",
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "Bespoke mobile applications for iOS and Android with offline capability.",
        features: ["iOS & Android Apps", "Offline Support", "Push Notifications"],
        techStack: ["React Native", "Expo"],
        priceMinUsd: 590,
        priceMaxUsd: 3450,
        priceMinEur: 550,
        priceMaxEur: 3200,
        priceMinBdt: 60000,
        priceMaxBdt: 350000,
        priceMin: 590,
        priceMax: 3450,
        published: true
    },
    {
        id: "fallback-6",
        title: "Cloud & API Systems",
        slug: "cloud-api-systems",
        description: "Secure backend databases and custom APIs connecting your platforms and external services.",
        features: ["Cloud Hosting", "Custom APIs", "Secure Databases"],
        techStack: ["AWS", "Docker"],
        priceMinUsd: 249,
        priceMaxUsd: 1190,
        priceMinEur: 230,
        priceMaxEur: 1100,
        priceMinBdt: 25000,
        priceMaxBdt: 120000,
        priceMin: 249,
        priceMax: 1190,
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
