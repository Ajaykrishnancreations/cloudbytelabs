/**
 * Course-specific roadmap step descriptions. Each course has its own map so a
 * shared step name (e.g. "Testing") never shows another course's wording.
 * Descriptions only restate topics that appear in that course's curriculum.
 */
export type RoadmapStep = { title: string; heading: string; body: string };

const salesforce: Record<string, [string, string]> = {
  Basics: [
    "Understand the Salesforce ecosystem",
    "Explore CRM, the Salesforce platform and your developer org. Get comfortable with the tools before building your first application.",
  ],
  Admin: [
    "Configure the way a business works",
    "Manage users, roles, profiles and permissions. Build a reliable foundation for the people using your application.",
  ],
  "Data Model": [
    "Turn business requirements into a data model",
    "Create objects, fields and relationships. Model realistic customer and service information.",
  ],
  Security: [
    "Give the right people the right access",
    "Practise sharing rules, field-level security and permissions. Design access deliberately, not as an afterthought.",
  ],
  Automation: [
    "Make everyday work flow",
    "Build and debug record-triggered flows, screen flows and reusable automation for real business processes.",
  ],
  JavaScript: [
    "Build your development foundation",
    "Learn modern JavaScript, functions, objects, modules and asynchronous programming before creating Lightning components.",
  ],
  Apex: [
    "Write business logic with confidence",
    "Work with Apex classes, collections, triggers and asynchronous jobs. Learn bulkification and governor-limit-aware code.",
  ],
  SOQL: [
    "Ask better questions of your data",
    "Query relationships, aggregate records and use SOQL and SOSL to retrieve the data your application needs.",
  ],
  LWC: [
    "Bring your Salesforce application to life",
    "Build Lightning Web Components with reactive data, component communication, Apex integration and accessible interfaces.",
  ],
  Testing: [
    "Prove that your solution works",
    "Write meaningful Apex tests and LWC Jest tests. Validate positive, negative, bulk and security scenarios.",
  ],
  Git: [
    "Work like a professional development team",
    "Use Git, branches and pull requests. Review code, validate quality and practise the deployment workflow.",
  ],
  "Real Project": [
    "Connect everything in one real project",
    "Build a customer service application with objects, security, Flow, Apex, LWC, reports and tests. Review and improve it with your mentor.",
  ],
  "Get Certified": [
    "Celebrate completing the program",
    "Wrap up your capstone, collect your course completion certificate and plan the Salesforce certification exam you want to take next. Vendor exams are booked separately.",
  ],
  "Interview Prep": [
    "Explain what you built and why",
    "Prepare your portfolio, practise technical interviews and learn to communicate your decisions. Career support, without unrealistic guarantees.",
  ],
  "Got the Job": [
    "Step into your first Salesforce role",
    "This is the goal every milestone builds toward. Walk into interviews with a real project, a portfolio and practised answers. We support your search; the offer is yours to win.",
  ],
};

const mern: Record<string, [string, string]> = {
  HTML: [
    "Structure the web",
    "Write semantic HTML5 and accessible forms — the foundation every interface is built on.",
  ],
  CSS: [
    "Lay out responsive interfaces",
    "Use CSS, Flexbox and Grid to build layouts that adapt from mobile to desktop.",
  ],
  JavaScript: [
    "Program the browser",
    "Work with functions, arrays, objects, scope, closures, modules, promises, async/await and the Fetch API.",
  ],
  React: [
    "Build interfaces from components",
    "Use JSX, props, state, hooks, context, routing and API integration to create reusable, well-structured components.",
  ],
  Node: [
    "Run JavaScript on the server",
    "Understand Node architecture, modules, NPM, environment variables, the file system and asynchronous server code.",
  ],
  Express: [
    "Design a clean API server",
    "Set up routing, controllers, middleware, validation, error handling, logging and security in Express.js.",
  ],
  MongoDB: [
    "Model and query your data",
    "Work with collections and documents, CRUD, indexing, aggregation, data modelling, MongoDB Atlas and Mongoose.",
  ],
  "REST API": [
    "Connect frontend and backend",
    "Apply REST architecture, HTTP status codes, pagination, filtering, searching, sorting and API validation with Postman.",
  ],
  Authentication: [
    "Keep accounts secure",
    "Implement password hashing, JWT, cookies, access and refresh token concepts and role-based authorization.",
  ],
  Testing: [
    "Ship with confidence",
    "Test components and APIs, debug issues and keep code consistent with ESLint and formatting.",
  ],
  Deployment: [
    "Put your application online",
    "Prepare production builds, deploy the frontend and backend, connect MongoDB Atlas and manage environment variables and logs.",
  ],
  "Real Project": [
    "Build a complete MERN application",
    "Bring everything together in a capstone such as an e-commerce application, learning platform, job portal, CRM or booking platform.",
  ],
};

const uiux: Record<string, [string, string]> = {
  Research: [
    "Start with the people you design for",
    "Run user interviews and surveys, analyse competitors and identify real user needs.",
  ],
  Problem: [
    "Frame the right problem",
    "Turn research findings into clear problem statements that guide every design decision.",
  ],
  Persona: [
    "Give your users a face",
    "Create personas that capture goals, needs and context from your research.",
  ],
  "User Flow": [
    "Map how people move through the product",
    "Design user flows, site maps, navigation and content hierarchy.",
  ],
  Wireframe: [
    "Sketch the structure",
    "Move from low- to mid-fidelity wireframes that test layout and flow before visual design.",
  ],
  "Visual Design": [
    "Make it clear and beautiful",
    "Apply typography, colour, layout, spacing, hierarchy, grid systems and icons in Figma.",
  ],
  Prototype: [
    "Bring the design to life",
    "Build interactive prototypes in Figma with components, Auto Layout and variants.",
  ],
  Test: [
    "Learn from real users",
    "Run usability tests, gather feedback and iterate on your design.",
  ],
  "Design System": [
    "Design at scale",
    "Create tokens, components, patterns and documentation, and prepare a clear developer handoff.",
  ],
  Portfolio: [
    "Tell the story of your work",
    "Present a case study covering research, wireframes, final screens and prototype.",
  ],
};

const python: Record<string, [string, string]> = {
  Syntax: [
    "Write your first programs",
    "Set up Python and learn syntax, variables, data types and operators.",
  ],
  Logic: [
    "Make your code decide and repeat",
    "Use conditions and loops to solve problems step by step.",
  ],
  "Data Structures": [
    "Organise your data",
    "Work with lists, tuples, sets and dictionaries.",
  ],
  Functions: [
    "Write reusable code",
    "Define functions with parameters and return values, understand scope and use lambdas.",
  ],
  OOP: [
    "Model the world in code",
    "Use classes, objects, constructors, encapsulation, inheritance and polymorphism.",
  ],
  Files: [
    "Read and write data",
    "Work with text, JSON and CSV files, and handle errors with exceptions.",
  ],
  APIs: [
    "Talk to other systems",
    "Understand HTTP, JSON and REST APIs, call APIs and get started with FastAPI and Flask.",
  ],
  Database: [
    "Store and retrieve data",
    "Learn SQL basics, database connections and CRUD operations.",
  ],
  Testing: [
    "Check that your code works",
    "Write unit tests, debug problems and organise your code.",
  ],
  Automation: [
    "Automate repetitive work",
    "Apply Python to everyday tasks through practical exercises and guided implementation.",
  ],
  "Real Project": [
    "Build your capstone",
    "Create an API and automation workflow that brings your Python skills together in one project.",
  ],
};

const teaching: Record<string, [string, string]> = {
  "Choose your goal": [
    "Start with where you want to go",
    "Pick the path that fits your goal — a mentor can help you choose a suitable starting point.",
  ],
  "Get your learning roadmap": [
    "See the whole path",
    "Follow a structured roadmap from fundamentals to professional practice.",
  ],
  "Join live training": [
    "Learn live with mentors",
    "The programs are designed around live, instructor-led sessions.",
  ],
  "Practise every concept": [
    "Learn it, then use it",
    "Guided practice follows every concept so you build skills, not just notes.",
  ],
  "Build assignments": [
    "Apply what you learn",
    "Assignments turn each module into something you have actually built.",
  ],
  "Develop real projects": [
    "Build something you can show",
    "Every learning path includes a capstone project you can explain and demonstrate.",
  ],
  "Receive code reviews": [
    "Understand the why",
    "Thoughtful reviews help you write cleaner, more maintainable code.",
  ],
  "Prepare your portfolio": [
    "Present your work",
    "Shape your resume, GitHub profile or design portfolio around your projects.",
  ],
  "Mock interviews": [
    "Practise before it counts",
    "Answer technical questions and explain your thinking with mentor feedback.",
  ],
  "Career support": [
    "Plan your next step",
    "Explore suitable roles and plan your next step. We do not promise employment or placements.",
  ],
};

const bySlug: Record<string, Record<string, [string, string]>> = {
  salesforce,
  "mern-stack": mern,
  "ui-ux": uiux,
  python,
  teaching,
};

/** Builds roadmap steps for a course (or "teaching"), never mixing courses. */
export function roadmapSteps(slug: string, titles: string[]): RoadmapStep[] {
  const map = bySlug[slug] ?? {};
  return titles.map((title) => {
    const [heading, body] = map[title] ?? [
      title,
      "Guided practice, hands-on assignments and mentor feedback.",
    ];
    return { title, heading, body };
  });
}
