import type { Project } from "@/types/project";

export const projects = [
  {
    id: "marketlink-team",
    slug: "marketlink-team",
    title: "MarketLink — Team Project",
    description: "A team project developed by three people, including me.",
    status: "live",
    collaboration: "team",
    role: "Project Manager & Backend Developer",
    teamSize: 3,
    technologies: [],
    liveUrl: "https://aptechmetrostargate.com:190/",
    liveUrlVerified: true,
    caseStudy: {
      overview:
        "A three-person team project for browsing farmers’ markets and seasonal products. My role was Project Manager and Backend Developer.",
      responsibilities: [
        "Contributed to project management.",
        "Contributed to backend development.",
      ],
      functionality: {
        kind: "confirmed",
        items: [
          "Market directory and visible filtering controls",
          "Product catalogue",
          "Market and product detail views",
        ],
      },
      contributionNote:
        "The application is shared team work. My role does not represent all of the team’s contributions.",
      evidenceNote:
        "The public HTTPS interface was accessible on 22 October 2026. Internal navigation worked; direct visits to inspected nested routes returned server 404s. Transactions and authenticated features were not verified. Displayed records and counters are not independently verified business outcomes.",
      pending: [
        "Additional functionality and backend implementation details",
        "Backend technologies and architecture",
        "Specific technical decisions and challenges",
        "Repository evidence",
      ],
    },
  },
  {
    id: "car-rental-system",
    slug: "car-rental-system",
    title: "Car Rental System",
    description:
      "Mileway: an independently developed application for managing cars, customers, and rentals.",
    status: "complete",
    collaboration: "solo",
    role: "Solo full-stack developer",
    technologies: ["ASP.NET Core MVC", "C#", "SQL Server"],
    caseStudy: {
      overview:
        "A completed application for managing cars, customers, and rentals, including a rental return workflow and data validation.",
      purpose:
        "Bring car, customer, and rental management together in an application, with support for recording rental returns and validating data.",
      responsibilities: [
        "Independently developed the frontend.",
        "Independently developed the backend.",
        "Independently developed the database.",
      ],
      functionality: {
        kind: "confirmed",
        items: [
          "Car management",
          "Customer management",
          "Rental management",
          "Rental return workflow",
          "Data validation",
        ],
      },
      evidenceNote:
        "Development is complete. Screenshots show the Mileway interface with approved demonstration records. A live deployment or use by real customers has not been confirmed.",
      pending: [
        "Data model and implementation details",
        "Verified technical decisions and challenges",
        "Repository evidence",
      ],
    },
  },
  {
    id: "school-website-cms",
    slug: "school-website-cms",
    title: "School Website & CMS",
    description:
      "A public school website and administrative content management.",
    status: "complete",
    collaboration: "solo",
    role: "Solo full-stack developer",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    caseStudy: {
      overview:
        "A completed public-facing school website paired with administrative content management, built with PHP and MySQL.",
      purpose:
        "Support a public website and administrative management of school-related content, from news and faculty to admissions and downloadable material.",
      responsibilities: [
        "Independently developed the frontend.",
        "Independently developed the backend.",
        "Independently developed the database.",
      ],
      functionality: {
        kind: "confirmed",
        items: [
          "Public-facing website",
          "Administrative content management",
          "News",
          "Faculty",
          "Gallery",
          "Admissions",
          "Downloads",
          "Site settings",
        ],
      },
      evidenceNote:
        "Development is complete. Screenshots show the public homepage and an earlier Phase 1 administrative dashboard, captured before the project was completed. The earlier dashboard does not demonstrate every completed CMS workflow. A live deployment, official adoption, or use by a school has not been verified.",
      pending: [
        "Content model and implementation details",
        "Verified technical decisions and challenges",
        "Repository evidence",
      ],
    },
  },
  {
    id: "marketlink-solo",
    slug: "marketlink-solo",
    title: "MarketLink — Solo Project",
    description:
      "An independently developed MarketLink project, separate from the team project.",
    status: "in-progress",
    collaboration: "solo",
    role: "Solo developer",
    technologies: ["MongoDB", "Express", "React", "Node.js"],
    caseStudy: {
      overview:
        "An independent MERN project under development. This version of MarketLink is separate from the collaborative team project.",
      purpose:
        "Explore product discovery and purchase-related workflows alongside farmer-facing functionality and administration.",
      responsibilities: [
        "Independently developed the frontend.",
        "Independently developed the backend.",
      ],
      functionality: {
        kind: "development",
        items: [
          "Authentication and user roles",
          "Product discovery",
          "Cart and checkout",
          "Orders",
          "Pickup scheduling",
          "Farmer functionality",
          "Administration",
          "Reviews and favorites",
        ],
        note: "These are development areas, not a claim that every feature is complete or production-ready.",
      },
      evidenceNote:
        "Screenshots show an in-progress application using fictional demonstration records and illustrative product photography. No public launch or production readiness is claimed.",
      pending: [
        "Feature-level implementation progress",
        "Architecture and documented technical decisions",
        "Verified challenges",
        "Repository evidence",
      ],
    },
  },
] as const satisfies readonly Project[];
