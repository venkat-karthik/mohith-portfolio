import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────────
  const seedUsername = process.env.ADMIN_SEED_USERNAME?.trim();
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (seedUsername && seedPassword) {
    const hashedPassword = await bcrypt.hash(seedPassword, 12);
    const user = await prisma.user.upsert({
      where: { username: seedUsername },
      update: { password: hashedPassword },
      create: { username: seedUsername, password: hashedPassword },
    });
    console.log("✓ Admin user:", user.username);
  } else {
    console.warn("Skipping admin seed. Set ADMIN_SEED_USERNAME and ADMIN_SEED_PASSWORD.");
  }

  // ── 1. Hero ─────────────────────────────────────────────────────────────────
  const heroCount = await prisma.hero.count();
  if (heroCount === 0) {
    await prisma.hero.create({
      data: {
        name: "Mohith",
        identityStatement: "Full Stack Engineer,UI/UX Designer,Problem Solver,Open Source Contributor",
        valueProposition:
          "I build premium digital experiences with modern web technologies, focusing on clean code and interactive storytelling.",
        ctaPrimaryText: "View Projects",
        ctaPrimaryLink: "#projects",
        ctaSecondaryText: "Contact Me",
        ctaSecondaryLink: "#contact",
        isAvailable: true,
        scrollCtaText: "Scroll",
      },
    });
    console.log("✓ Hero section created.");
  } else {
    await prisma.hero.updateMany({
      data: { isAvailable: true, scrollCtaText: "Scroll" },
    });
    console.log("✓ Hero section updated.");
  }

  // ── 2. About ─────────────────────────────────────────────────────────────────
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    await prisma.about.create({
      data: {
        content:
          "Hey, I'm Mohith — a full-stack engineer who loves crafting beautiful, performant web experiences.\n\nI specialize in React, Next.js, and Node.js, with a strong eye for design and a passion for clean, maintainable code. I've worked on everything from SaaS dashboards to real-time apps and open-source tooling.\n\nWhen I'm not coding, you'll find me exploring new tech, contributing to open source, or writing about what I've learned.",
      },
    });
    console.log("✓ About section created.");
  }

  // ── 3. Contact ───────────────────────────────────────────────────────────────
  const contactCount = await prisma.contact.count();
  if (contactCount === 0) {
    await prisma.contact.create({
      data: {
        email: "mohi756@gmail.com",
        github: "https://github.com/mohitho7",
        linkedin: "https://linkedin.com/in/mohith-mathukumalli",
        twitter: "https://twitter.com/mohitho7",
      },
    });
    console.log("✓ Contact info created.");
  }

  // ── 4. Skills ────────────────────────────────────────────────────────────────
  const skillCategoryCount = await prisma.skillCategory.count();
  if (skillCategoryCount === 0) {
    await prisma.skillCategory.create({
      data: {
        name: "Frontend",
        order: 1,
        skills: {
          create: [
            { name: "React", level: 9, order: 1 },
            { name: "Next.js", level: 9, order: 2 },
            { name: "TypeScript", level: 8, order: 3 },
            { name: "Tailwind CSS", level: 9, order: 4 },
            { name: "Framer Motion", level: 7, order: 5 },
          ],
        },
      },
    });
    await prisma.skillCategory.create({
      data: {
        name: "Backend",
        order: 2,
        skills: {
          create: [
            { name: "Node.js", level: 8, order: 1 },
            { name: "Prisma ORM", level: 9, order: 2 },
            { name: "PostgreSQL", level: 7, order: 3 },
            { name: "REST APIs", level: 9, order: 4 },
            { name: "NextAuth.js", level: 8, order: 5 },
          ],
        },
      },
    });
    await prisma.skillCategory.create({
      data: {
        name: "Tools & DevOps",
        order: 3,
        skills: {
          create: [
            { name: "Git & GitHub", level: 9, order: 1 },
            { name: "Docker", level: 6, order: 2 },
            { name: "Vercel", level: 9, order: 3 },
            { name: "Supabase", level: 8, order: 4 },
            { name: "Figma", level: 7, order: 5 },
          ],
        },
      },
    });
    console.log("✓ Skills created.");
  }

  // ── 5. Projects ──────────────────────────────────────────────────────────────
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Portfolio CMS",
          description:
            "A full-stack portfolio website with a custom admin CMS built on Next.js 16, Prisma, and Supabase. Features JWT auth, CSRF protection, and a glass-morphism UI.",
          techStack: "Next.js, TypeScript, Prisma, Supabase, NextAuth",
          outcome: "Deployed and managing live portfolio content with zero downtime.",
          demoLink: "https://mohith.dev",
          githubLink: "https://github.com/mohitho7/portfolio",
          isPinned: true,
          order: 1,
        },
        {
          title: "Real-Time Chat App",
          description:
            "A WebSocket-powered chat application with rooms, typing indicators, and message history. Built with Socket.io and a React frontend.",
          techStack: "React, Socket.io, Node.js, MongoDB",
          outcome: "Handles 500+ concurrent connections with sub-100ms latency.",
          githubLink: "https://github.com/mohitho7/chat-app",
          isPinned: true,
          order: 2,
        },
        {
          title: "AI Task Manager",
          description:
            "A productivity app that uses OpenAI to auto-prioritize tasks, suggest deadlines, and generate subtasks from a plain-text description.",
          techStack: "Next.js, OpenAI API, Prisma, PostgreSQL",
          outcome: "Reduced task planning time by 40% in user testing.",
          demoLink: "https://ai-tasks.mohith.dev",
          githubLink: "https://github.com/mohitho7/ai-tasks",
          isPinned: true,
          order: 3,
        },
        {
          title: "E-Commerce Dashboard",
          description:
            "An analytics dashboard for e-commerce stores with real-time sales charts, inventory tracking, and customer insights.",
          techStack: "React, Recharts, Node.js, PostgreSQL",
          outcome: "Used by 3 small businesses to track over $50k in monthly revenue.",
          githubLink: "https://github.com/mohitho7/ecom-dashboard",
          isPinned: false,
          order: 4,
        },
        {
          title: "Open Source CLI Tool",
          description:
            "A developer CLI that scaffolds Next.js projects with pre-configured ESLint, Prettier, Husky, and folder structure in under 10 seconds.",
          techStack: "Node.js, Commander.js, Inquirer",
          outcome: "500+ downloads on npm in the first month.",
          githubLink: "https://github.com/mohitho7/create-next-app-pro",
          isPinned: false,
          order: 5,
        },
      ],
    });
    console.log("✓ Projects created.");
  }

  // ── 6. Timeline ──────────────────────────────────────────────────────────────
  const timelineCount = await prisma.timelineItem.count();
  if (timelineCount === 0) {
    await prisma.timelineItem.createMany({
      data: [
        {
          title: "B.Tech in Computer Science",
          type: "Education",
          date: "2021 – 2025",
          description:
            "Pursuing a Bachelor's in Computer Science with a focus on software engineering, data structures, and web technologies. Maintaining a strong GPA while actively participating in hackathons.",
          order: 1,
        },
        {
          title: "Full Stack Intern — TechStartup",
          type: "Internship",
          date: "May 2024 – Aug 2024",
          description:
            "Built and shipped 3 production features for a SaaS platform used by 10k+ users. Worked with React, Node.js, and PostgreSQL in an agile team of 8 engineers.",
          order: 2,
        },
        {
          title: "Won National Hackathon — HackIndia",
          type: "Milestone",
          date: "March 2024",
          description:
            "Led a team of 4 to build an AI-powered accessibility tool in 36 hours. Won 1st place out of 200+ teams and received a ₹1L prize.",
          order: 3,
        },
        {
          title: "Frontend Intern — Agency",
          type: "Internship",
          date: "Dec 2023 – Feb 2024",
          description:
            "Developed responsive landing pages and UI components for 5 client projects. Improved Lighthouse performance scores from 60 to 95+ across all projects.",
          order: 4,
        },
        {
          title: "Started Open Source Journey",
          type: "Milestone",
          date: "Jan 2023",
          description:
            "Made first open source contribution to a popular React component library. Since then, contributed to 10+ repositories with 200+ GitHub stars earned.",
          order: 5,
        },
      ],
    });
    console.log("✓ Timeline created.");
  }

  // ── 7. Achievements ──────────────────────────────────────────────────────────
  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: "1st Place — HackIndia National Hackathon",
          type: "Hackathon",
          date: "March 2024",
          description:
            "Won first place out of 200+ teams at India's largest student hackathon. Built an AI accessibility tool that converts complex text to simple language in real time.",
          isPinned: true,
          order: 1,
        },
        {
          title: "AWS Certified Cloud Practitioner",
          type: "Certification",
          date: "Jan 2024",
          description:
            "Earned the AWS Cloud Practitioner certification, demonstrating foundational knowledge of AWS cloud services, architecture, and pricing.",
          isPinned: true,
          order: 2,
        },
        {
          title: "Top 10 — Smart India Hackathon",
          type: "Hackathon",
          date: "Sep 2023",
          description:
            "Reached the national finals of Smart India Hackathon with a solution for automating government document verification using OCR and ML.",
          isPinned: true,
          order: 3,
        },
        {
          title: "Meta Frontend Developer Certificate",
          type: "Certification",
          date: "Jun 2023",
          description:
            "Completed Meta's professional frontend developer certificate on Coursera, covering React, advanced JavaScript, and UI/UX principles.",
          isPinned: false,
          order: 4,
        },
        {
          title: "500+ npm Downloads — create-next-app-pro",
          type: "Open Source",
          date: "Feb 2024",
          description:
            "Published an open source CLI tool that reached 500+ downloads in its first month, featured in a popular developer newsletter.",
          isPinned: false,
          order: 5,
        },
      ],
    });
    console.log("✓ Achievements created.");
  }

  // ── 8. Testimonials ──────────────────────────────────────────────────────────
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          quote:
            "Mohith is one of the most talented engineers I've worked with. He shipped features faster than anyone on the team and always wrote clean, well-documented code.",
          authorName: "Priya Sharma",
          authorRole: "Engineering Manager",
          authorContext: "TechStartup Internship",
          order: 1,
        },
        {
          quote:
            "Working with Mohith on our hackathon project was incredible. His ability to architect a full solution under pressure and lead the team to victory was impressive.",
          authorName: "Arjun Reddy",
          authorRole: "Teammate & Fellow Developer",
          authorContext: "HackIndia 2024",
          order: 2,
        },
        {
          quote:
            "Mohith redesigned our entire frontend in 3 weeks. The performance improvements and visual polish he delivered exceeded our expectations completely.",
          authorName: "Kavya Nair",
          authorRole: "Founder",
          authorContext: "Agency Client",
          order: 3,
        },
      ],
    });
    console.log("✓ Testimonials created.");
  }

  // ── 9. Blogs ─────────────────────────────────────────────────────────────────
  const blogCount = await prisma.blog.count();
  if (blogCount === 0) {
    await prisma.blog.createMany({
      data: [
        {
          title: "Why I Switched from Create React App to Next.js",
          excerpt:
            "After years of CRA, I made the jump to Next.js. Here's what changed, what got better, and what surprised me along the way.",
          content:
            "## The Problem with CRA\n\nCreate React App served us well for years, but as projects grew, the cracks started showing — slow builds, no SSR, and a bloated webpack config you couldn't touch.\n\n## Enter Next.js\n\nNext.js solved all of this out of the box. File-based routing, server components, API routes, and Turbopack for blazing fast dev builds.\n\n## What I Miss\n\nHonestly? Not much. The only thing I occasionally miss is the simplicity of a pure SPA. But for anything production-grade, Next.js wins every time.\n\n## Conclusion\n\nIf you're still on CRA, make the switch. Your future self will thank you.",
          readingTime: "4 min read",
          category: "Next.js",
          isPinned: true,
          isPublished: true,
          order: 1,
        },
        {
          title: "TypeScript Tips That Actually Save Time",
          excerpt:
            "Not the basics — these are the TypeScript patterns I use daily that genuinely speed up development and catch bugs before they happen.",
          content:
            "## 1. Use `satisfies` Instead of Type Assertions\n\nThe `satisfies` operator validates a value against a type without widening it. Much safer than `as`.\n\n## 2. Discriminated Unions for API Responses\n\nInstead of `{ data?: T, error?: string }`, use `{ ok: true, data: T } | { ok: false, error: string }`. TypeScript narrows perfectly.\n\n## 3. Template Literal Types\n\nGreat for building typed event names, CSS class strings, or API endpoint paths.\n\n## 4. `infer` in Conditional Types\n\nOnce you understand `infer`, you can extract types from anywhere — function return types, promise values, array elements.\n\n## Wrapping Up\n\nTypeScript's type system is incredibly powerful. These patterns are just the start.",
          readingTime: "6 min read",
          category: "TypeScript",
          isPinned: true,
          isPublished: true,
          order: 2,
        },
        {
          title: "Building a Secure Admin Panel with NextAuth",
          excerpt:
            "A practical guide to setting up authentication, CSRF protection, and session management in a Next.js admin dashboard.",
          content:
            "## Why Security Matters in Admin Panels\n\nAdmin panels are high-value targets. A single vulnerability can expose your entire database.\n\n## NextAuth Setup\n\nStart with the Credentials provider and bcrypt for password hashing. Never store plain text passwords.\n\n## CSRF Protection\n\nAlways validate the `X-Requested-With` header and origin on mutating requests. This prevents cross-site request forgery attacks.\n\n## Session Management\n\nUse JWT sessions with a bounded max age (8 hours is reasonable). Rotate secrets regularly in production.\n\n## Final Checklist\n\n- HTTPS only in production\n- Secure cookies\n- Rate limiting on login endpoint\n- Audit logs for admin actions",
          readingTime: "8 min read",
          category: "Security",
          isPinned: true,
          isPublished: true,
          order: 3,
        },
      ],
    });
    console.log("✓ Blogs created.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\n🌱 Seed complete!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
