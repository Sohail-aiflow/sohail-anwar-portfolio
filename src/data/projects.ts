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
    liveUrlVerified: false,
    caseStudy: {
      overview:
        "A collaborative software project developed by a three-member team, including me. This case study documents my confirmed contribution and the evidence currently available.",
      responsibilities: [
        "Contributed to project management.",
        "Contributed to backend development.",
      ],
      contributionNote:
        "The application is shared team work. My role does not represent all of the team’s contributions.",
      evidenceNote:
        "The supplied project URL is available below. Its public accessibility has not been independently verified.",
      pending: [
        "Project purpose and confirmed functionality",
        "Backend technologies and architecture",
        "Specific technical decisions and challenges",
        "Screenshots and repository evidence",
      ],
    },
  },
  {
    id: "car-rental-system",
    slug: "car-rental-system",
    title: "Car Rental System",
    description: "Car, customer, and rental management.",
    status: "complete",
    collaboration: "unconfirmed",
    technologies: ["ASP.NET Core MVC", "SQL Server"],
    caseStudy: {
      overview:
        "A completed application for managing cars, customers, and rentals, including a rental return workflow and data validation.",
      purpose:
        "Bring car, customer, and rental management together in an application, with support for recording rental returns and validating data.",
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
        "Development is complete. A live deployment or use by real customers has not been confirmed.",
      pending: [
        "My specific role and collaboration context",
        "Data model and implementation details",
        "Verified technical decisions and challenges",
        "Screenshots and repository evidence",
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
    collaboration: "unconfirmed",
    technologies: ["PHP", "MySQL"],
    caseStudy: {
      overview:
        "A completed public-facing school website paired with administrative content management, built with PHP and MySQL.",
      purpose:
        "Support a public website and administrative management of school-related content, from news and faculty to admissions and downloadable material.",
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
        "Development is complete. A live deployment, official adoption, or use by a school has not been verified.",
      pending: [
        "My specific role and collaboration context",
        "Content model and implementation details",
        "Verified technical decisions and challenges",
        "Screenshots and repository evidence",
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
    role: "Independent developer",
    technologies: ["MongoDB", "Express", "React", "Node.js"],
    caseStudy: {
      overview:
        "An independent MERN project under development. This version of MarketLink is separate from the collaborative team project.",
      purpose:
        "Explore product discovery and purchase-related workflows alongside farmer-facing functionality and administration.",
      responsibilities: [
        "Independent development of this version of MarketLink.",
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
        "The project is in progress. No public launch, production readiness, or live deployment is claimed.",
      pending: [
        "Feature-level implementation progress",
        "Architecture and documented technical decisions",
        "Verified challenges",
        "Screenshots and repository evidence",
      ],
    },
  },
] as const satisfies readonly Project[];
