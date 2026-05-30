import prisma from "../src/db";
import bcrypt from "bcrypt";

const videoData = [
  {
    title: "Introduction to Next.js 14 & App Router",
    description: "Learn the fundamentals of Next.js 14, including server components, routing, data fetching, and layouts in this comprehensive crash course.",
  },
  {
    title: "Mastering TypeScript Generics",
    description: "Dive deep into TypeScript generics. Learn how to write reusable, type-safe components, helper functions, and API wrappers.",
  },
  {
    title: "How to Deploy PostgreSQL on Neon in Minutes",
    description: "A step-by-step guide on setting up a serverless PostgreSQL database with Neon, configuring connection pooling, and connecting Prisma.",
  },
  {
    title: "Building a Real-time Chat App with WebSockets",
    description: "Learn how to build a scalable, real-time chat application using Node.js, Express, Socket.io, and a React frontend.",
  },
  {
    title: "Advanced CSS Grid Layouts & Subgrid",
    description: "Explore advanced CSS Grid techniques including subgrid, responsive grid layouts without media queries, and alignment tricks.",
  },
  {
    title: "React Server Components Explained",
    description: "What are React Server Components (RSC)? Learn the difference between client and server components and when to use each.",
  },
  {
    title: "Tailwind CSS Tips and Tricks for Clean UI",
    description: "Boost your frontend workflow with these advanced Tailwind CSS tips, custom config options, and responsive styling techniques.",
  },
  {
    title: "Getting Started with Prisma ORM",
    description: "Learn how to model data, run migrations, seed data, and write queries using Prisma ORM with PostgreSQL.",
  },
  {
    title: "Dockerizing a Node.js Express Application",
    description: "A beginner's guide to containerizing Node.js apps with Docker, writing Dockerfiles, and using Docker Compose.",
  },
  {
    title: "REST API Design Best Practices",
    description: "Learn how to design clean, scalable, and secure REST APIs using proper HTTP methods, status codes, and JSON response formats.",
  },
  {
    title: "GraphQL vs REST in 2026",
    description: "A head-to-head comparison of REST and GraphQL. Discussing performance, developer experience, and suitable use cases.",
  },
  {
    title: "Understanding OAuth 2.0 and JWT Auth",
    description: "An in-depth explanation of how OAuth 2.0 flows work and how to securely implement JWT-based authentication in Node.js.",
  },
  {
    title: "Rust for Web Developers: A Gentle Intro",
    description: "Curious about Rust? Learn the basics of Rust syntax, ownership, and how to write a simple HTTP server using Actix-web.",
  },
  {
    title: "10 Git Commands You Should Know",
    description: "Level up your version control workflow with these essential Git commands for rebasing, cherry-picking, and reflog.",
  },
  {
    title: "CSS Flexbox: The Ultimate Guide",
    description: "Master CSS Flexbox layout system with interactive visual examples of alignment, spacing, and wrapping.",
  },
  {
    title: "Building a Personal Portfolio Site with Astro",
    description: "Learn how to build an ultra-fast, SEO-friendly personal portfolio site using Astro and Tailwind CSS.",
  },
  {
    title: "A Guide to Clean Code in JavaScript",
    description: "Improve the readability and maintainability of your JavaScript projects with these solid clean-coding principles.",
  },
  {
    title: "Introduction to Python for Web Developers",
    description: "Learn Python fundamentals, data structures, and how it compares to JavaScript for backend development.",
  },
  {
    title: "FastAPI Crash Course with Python",
    description: "Learn how to build high-performance APIs with Python, FastAPI, and Pydantic for validation.",
  },
  {
    title: "Deploying Web Apps with Vercel and Netlify",
    description: "Compare Vercel and Netlify for hosting frontend applications, configure environment variables, and custom domains.",
  },
  {
    title: "State Management in React with Zustand",
    description: "Ditch Redux! Learn how to manage global state in React applications with Zustand, a simple and fast state management library.",
  },
  {
    title: "Intro to Serverless Functions on AWS Lambda",
    description: "Learn how to write, deploy, and scale serverless functions using AWS Lambda and API Gateway.",
  },
  {
    title: "Web Performance Optimization: 2026 Guide",
    description: "Optimizing Core Web Vitals, image compression, lazy loading, and modern caching strategies for lightning fast sites.",
  },
  {
    title: "Web Accessibility (a11y) Basics",
    description: "Ensure your website is accessible to everyone. Learn about ARIA roles, keyboard navigation, and screen reader testing.",
  },
  {
    title: "Microservices Architecture Explained",
    description: "An introduction to microservices. Discussing service discovery, API gateways, databases per service, and communication.",
  },
  {
    title: "SQL Queries Every Developer Should Know",
    description: "Master SQL fundamentals including JOINS, GROUP BY, subqueries, and window functions for efficient database querying.",
  },
  {
    title: "Intro to Redis and Backend Caching",
    description: "Improve response times by caching heavy database queries using Redis in a Node.js backend.",
  },
  {
    title: "Node.js Performance Tuning & Profiling",
    description: "Identify and resolve memory leaks, CPU bottlenecks, and optimize event loop performance in Node.js.",
  },
  {
    title: "Asynchronous JavaScript: Promises & Async/Await",
    description: "Understand the event loop, callback queue, promises, and write clean asynchronous code with async/await.",
  },
  {
    title: "Understanding the Node.js Event Loop",
    description: "How does Node.js handle concurrency? A deep dive into the event loop phases and libuv threads.",
  },
  {
    title: "Testing React Apps with Vitest & RTL",
    description: "Learn how to write unit and integration tests for React components using Vitest and React Testing Library.",
  },
  {
    title: "Intro to CI/CD Pipelines with GitHub Actions",
    description: "Automate your testing, linting, and deployment flows using GitHub Actions and YAML workflows.",
  },
  {
    title: "Setting up ESLint, Prettier, and Husky",
    description: "Maintain code quality and style automatically across your team with pre-commit hooks and linters.",
  },
  {
    title: "Monorepos with Turborepo and pnpm",
    description: "Learn how to manage a monorepo workspace containing multiple frontend and backend packages with Turborepo.",
  },
  {
    title: "Kubernetes for Beginners: Deploy Pods",
    description: "Learn the core concepts of Kubernetes: Pods, Services, Deployments, and how to set up a local cluster.",
  },
  {
    title: "Introduction to AWS S3 and File Uploads",
    description: "Securely upload and serve user-generated files using AWS S3, IAM policies, and presigned URLs.",
  },
  {
    title: "Responsive Web Design Principles in 2026",
    description: "How to build interfaces that adapt beautifully to mobile, tablet, desktop, and ultra-wide screens.",
  },
  {
    title: "Semantic HTML and SEO Best Practices",
    description: "Boost your organic search rankings by structuring your web pages using semantic HTML tags and meta tags.",
  },
  {
    title: "Creating Custom React Hooks for Reusability",
    description: "Extract component logic into reusable custom React hooks for fetching data, dark mode, window size, and more.",
  },
  {
    title: "Introduction to Vite: Dev Tooling Reimagined",
    description: "Why you should migrate from Create React App to Vite for faster hot module replacement (HMR) and builds.",
  },
  {
    title: "Database Indexing Explained: Speed up Queries",
    description: "Learn how databases store indexes, when to create compound indexes, and how indexing affects write performance.",
  },
  {
    title: "Error Handling in Express APIs: A Clean Approach",
    description: "Design a centralized error handler middleware in Express to catch sync/async errors and format clean API errors.",
  },
  {
    title: "Introduction to Docker Compose",
    description: "Manage multi-container applications easily. Run Node.js, Postgres, and Redis together with a single command.",
  },
  {
    title: "Design Patterns in TypeScript",
    description: "Learn how to implement classic GoF design patterns like Singleton, Factory, and Observer using TypeScript.",
  },
  {
    title: "Building a CLI Tool with Node.js & Commander",
    description: "Create interactive command-line interface tools with Node.js, parse arguments, and print colored output.",
  },
];

async function main() {
  console.log("Seeding database with realistic video data...");

  // 1. Get existing channels
  let channels = await prisma.channel.findMany();

  if (channels.length === 0) {
    console.log("No channels found. Creating a default user and channel...");
    let user = await prisma.user.findFirst({
      where: { email: "dev.user@example.com" }
    });
    if (!user) {
      const hashedPassword = bcrypt.hashSync("DevPassword123!", 10);
      user = await prisma.user.create({
        data: {
          email: "dev.user@example.com",
          name: "Dev Creator",
          password: hashedPassword,
        }
      });
    }

    const channel = await prisma.channel.create({
      data: {
        name: "Dev Channel",
        description: "The official dev channel for tech videos.",
        userId: user.id,
      }
    });
    channels = [channel];
  }

  console.log(`Found ${channels.length} channels to distribute videos to.`);

  // 2. Generate video records
  const dummyVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const createdVideosCount = await prisma.video.count();
  console.log(`Currently there are ${createdVideosCount} videos in the database.`);

  let seededCount = 0;
  for (let i = 0; i < videoData.length; i++) {
    const item = videoData[i];
    const channel = channels[i % channels.length];

    // Create random created_at date within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(createdAt.getHours() - hoursAgo);

    await prisma.video.create({
      data: {
        title: item.title,
        description: item.description,
        videoUrl: dummyVideoUrl,
        thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(item.title)}/640/360`,
        status: "UPLOADED",
        type: "PUBLIC",
        createdAt: createdAt,
        channelId: channel.id,
        viewsCount: Math.floor(Math.random() * 10000) + 50,
        likeCount: Math.floor(Math.random() * 500) + 5,
      }
    });
    seededCount++;
  }

  const finalVideosCount = await prisma.video.count();
  console.log(`Successfully seeded ${seededCount} videos! Total count is now ${finalVideosCount}.`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
