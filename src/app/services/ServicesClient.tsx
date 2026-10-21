"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Cloud, Code2, Cuboid, Smartphone, Workflow } from "lucide-react";
import styles from "./Services.module.css";

const services = [
  { number: "01", slug: "custom-software-development", title: "Custom Software Development", description: "Business systems, internal tools, and client platforms built to scale cleanly.", features: ["UI/UX Design", "Responsive Frontend", "Core REST APIs"], image: "/redesign/service-software.png", icon: Code2, kind: "software" },
  { number: "02", slug: "ai-agent-development", title: "AI Agent Development", description: "Custom virtual assistants, data extraction tools, and decision-support systems.", features: ["Custom AI Models", "Search Systems", "AI Chat Integration"], image: "/redesign/service-ai.png", icon: Bot, kind: "ai" },
  { number: "03", slug: "workflow-automation", title: "Workflow Automation", description: "Automatic data transfer and task synchronization across your business software.", features: ["System Integration", "Automatic Alerts", "Data Syncing"], image: "/redesign/service-automation.png", icon: Workflow, kind: "automation" },
  { number: "04", slug: "saas-product-development", title: "SaaS Product Development", description: "Subscription-based web applications with user dashboards and automated billing.", features: ["Secure Login", "Subscription Billing", "User Dashboards"], image: "/redesign/service-saas.png", icon: Cuboid, kind: "saas" },
  { number: "05", slug: "mobile-app-development", title: "Mobile App Development", description: "Bespoke mobile applications for iOS and Android with offline capability.", features: ["iOS & Android Apps", "Offline Support", "Push Notifications"], image: "/redesign/service-mobile.png", icon: Smartphone, kind: "mobile" },
  { number: "06", slug: "cloud-api-systems", title: "Cloud & API Systems", description: "Secure backend databases and custom APIs connecting your platforms and external services.", features: ["Cloud Hosting", "Custom APIs", "Secure Databases"], image: "/redesign/service-cloud.png", icon: Cloud, kind: "cloud" },
] as const;

type Service = (typeof services)[number];

function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const Icon = service.icon;
  return (
    <Link href={`/services/${service.slug}`} className={`${styles.card} ${styles[service.kind]} ${featured ? styles.featured : ""}`} aria-label={`Explore ${service.title}`}>
      {featured && <Image className={styles.featuredDesktopArt} src="/redesign/service-featured-card.png" alt="" fill unoptimized sizes="(max-width: 1100px) 100vw, 35vw" />}
      <span className={styles.number}>#{service.number}</span>
      <span className={styles.icon}><Icon size={19} strokeWidth={2.2} aria-hidden="true" /></span>
      {featured && <span className={styles.featureIcon}><Code2 size={25} aria-hidden="true" /></span>}
      <div className={styles.cardCopy}>
        <h2>{service.title}</h2>
        <p>{service.description}</p>
        <div className={styles.tags}>{service.features.map((feature) => <span key={feature}>{feature}</span>)}</div>
      </div>
      <Image className={styles.art} src={service.image} alt="" width={380} height={380} unoptimized />
      <span className={styles.cardAction}>Explore route <ArrowRight size={16} aria-hidden="true" /></span>
    </Link>
  );
}

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span />What we do</p>
            <h1>Engineering ambitious<br className={styles.desktopBreak} /> ideas into reality<span>.</span></h1>
            <p className={styles.intro}>High-performance engineering designed for clarity, performance, and scale. We build clean digital tools, AI agents, and workflows that help modern businesses move faster.</p>
            <Link className={styles.primaryButton} href="/contact">Let&apos;s build <ArrowRight size={19} aria-hidden="true" /></Link>
          </div>
          <div className={styles.heroVisual} aria-hidden="true"><Image src="/redesign/services-dashboard.png" alt="" fill priority unoptimized sizes="(max-width: 900px) 100vw, 50vw" /></div>
        </header>

        <section className={styles.servicesGrid} aria-label="Our services">
          <ServiceCard service={services[0]} featured />
          <div className={styles.otherServices}>
            <div className={styles.topRow}>{services.slice(1, 3).map((service) => <ServiceCard key={service.slug} service={service} />)}</div>
            <div className={styles.bottomRow}>{services.slice(3).map((service) => <ServiceCard key={service.slug} service={service} />)}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
