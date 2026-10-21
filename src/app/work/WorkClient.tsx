"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Work.module.css";

interface Project {
  id: string;
  title: string;
  category: string[] | string;
  description: string;
  thumbnail?: string;
  slug: string;
  liveUrl?: string;
}

const categories = ["All", "Web Design", "Web App", "Mobile App", "AI & ML", "Automation", "SaaS"];
function matchesCategory(project: Project, filter: string) {
  if (filter === "All") return true;
  const values = Array.isArray(project.category) ? project.category : [project.category];
  return values.some((value) => value.toLowerCase().includes(filter.toLowerCase()));
}

function projectImage(project: Project) {
  if (!project.thumbnail) return "";
  if (project.thumbnail.startsWith("https://")) return project.thumbnail;
  if (project.thumbnail.startsWith("http://")) return `/api/image-proxy?url=${encodeURIComponent(project.thumbnail)}`;
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "https://jantrasoft.online").replace(/\/api\/?$/, "");
  return `${apiOrigin}${project.thumbnail.startsWith("/") ? "" : "/"}${project.thumbnail}`;
}

function FeaturedProject({ project }: { project: Project }) {
  const image = projectImage(project);
  const category = Array.isArray(project.category) ? project.category[0] : project.category;
  return (
    <article className={styles.featuredCard}>
      {image ? <Image src={image} alt={`${project.title} project`} fill sizes="(max-width: 750px) 100vw, 50vw" unoptimized className={styles.featuredImage} priority /> : <div className={styles.imageFallback}>Image unavailable</div>}
      <span className={styles.featuredCategory}>{category}</span>
      <Link className={styles.featuredLink} href={`/work/${project.slug}`} aria-label={`View ${project.title} case study`} />
      {project.liveUrl && <a className={styles.featuredDemo} href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live demo`}>Live demo <ArrowRight size={14} aria-hidden="true" /></a>}
      <span className={styles.featuredCaseLink}>View case study <ArrowRight size={16} aria-hidden="true" /></span>
      <div className={styles.mobileFeaturedCaption}><h2>{project.title}</h2><span className={styles.mobileView}>View case study <ArrowRight size={16} /></span></div>
    </article>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const image = projectImage(project);
  const category = Array.isArray(project.category) ? project.category[0] : project.category;
  return (
    <article className={styles.projectCard}>
      <Link href={`/work/${project.slug}`} className={styles.projectLink} aria-label={`View ${project.title} case study`}>
        <div className={styles.projectImage}>
          {image ? <Image src={image} alt={`${project.title} project`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" unoptimized /> : <span className={styles.imageFallback}>Image unavailable</span>}
        </div>
        <div className={styles.projectBody}>
          <span className={styles.projectNumber}>Deployment #{String(index + 1).padStart(2, "0")}</span>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <span className={styles.viewLink}>View case study <ArrowRight size={16} aria-hidden="true" /></span>
        </div>
      </Link>
      {project.liveUrl && <a className={styles.projectLive} href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live demo`}>Live demo ↗</a>}
      <span className={styles.categoryTag}>{category}</span>
    </article>
  );
}

export default function WorkPage({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const projects = useMemo(() => initialProjects.filter((project) => matchesCategory(project, filter)), [initialProjects, filter]);
  const featured = filter === "All" ? projects.slice(0, 2) : [];
  const remaining = filter === "All" ? projects.slice(2) : projects;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}><span />Selected work</p>
            <h1>Ideas made real<span>.</span></h1>
            <p className={styles.subtitle}>Digital products built for real-world impact.</p>
          </div>
          <div className={styles.filters} role="group" aria-label="Filter projects by category">
            {categories.map((category) => <button key={category} type="button" onClick={() => setFilter(category)} aria-pressed={filter === category} className={filter === category ? styles.activeFilter : ""}>{category}</button>)}
          </div>
        </header>

        {projects.length === 0 ? <div className={styles.empty}><h2>No projects found</h2><p>{filter === "All" ? "Our work is unavailable right now. Please check back soon." : "Try another category to see more work."}</p></div> : <>
          {featured.length > 0 && <section className={styles.featuredGrid} aria-label="Featured projects">{featured.map((project) => <FeaturedProject key={project.id} project={project} />)}</section>}
          {remaining.length > 0 && <section className={styles.projectGrid} aria-label="More projects">{remaining.map((project, index) => <ProjectCard key={project.id} project={project} index={index + featured.length} />)}</section>}
        </>}
      </div>
    </main>
  );
}
