/* ============================================================================
   PORTFOLIO DATA — single source of truth for the dynamic parts of the site
   ----------------------------------------------------------------------------
   ▸ GITHUB PROFILE
     GITHUB_PROFILE_URL is the profile link used by every JS-rendered part of
     the site (project cards, case studies, follow-along links). The same
     profile URL is also linked directly in index.html — navigation, hero,
     about, contact and footer.

     Profile: https://github.com/jadhavniraj793-hue

   ▸ PROJECTS
     Each project below is part of the portfolio roadmap. Repositories are
     published step by step — until a repository actually exists, keep
     `githubUrl` set to `null` and the site automatically displays:

         "GitHub Repository — Coming Soon"

     When a repository goes live, set it to the real repository URL, e.g.:

         githubUrl: "https://github.com/jadhavniraj793-hue/sales-performance-dashboard"

     The project card and its case study will then switch to
     "View on GitHub →" automatically.

     ⚠ Only ever link to repositories that actually exist — never invent a
       GitHub username, repository or URL.
   ========================================================================== */

const GITHUB_PROFILE_URL = "https://github.com/jadhavniraj793-hue";

/* --------------------------------------------------------------------------
   Projects
   status:  "in-progress" | "planned" | "learning"
   githubUrl: string (real repository URL) or null (not published yet)
   -------------------------------------------------------------------------- */

const PROJECTS = [
  {
    id: "sales-performance-dashboard",
    title: "Sales Performance Dashboard",
    status: "in-progress",
    githubUrl: null, // TODO: set the repository URL once it is published
    summary:
      "An interactive Power BI dashboard that brings sales data together in one place — revenue, top products and regional performance with drill-through pages and dynamic filtering.",
    tags: ["Power BI", "SQL", "DAX", "Data Modeling"],
    caseStudy: {
      overview:
        "The goal of this project is to give a sales team a single view that answers their everyday questions: how are we tracking against targets, which products and regions are driving revenue, and where should attention go this month?",
      objectives: [
        "Model raw sales data into a clean, documented star schema",
        "Build KPI cards for revenue, orders and average order value",
        "Design drill-through pages for region, product and customer views",
        "Keep the report refreshable from source with minimal manual steps",
      ],
      approach:
        "SQL for extraction and transformation, Power Query for shaping the data, DAX for measures and time intelligence, and Power BI for interactive visual design.",
      tools: ["SQL", "Power Query", "DAX", "Power BI"],
    },
  },
  {
    id: "customer-churn-analysis",
    title: "Customer Churn Analysis",
    status: "in-progress",
    githubUrl: null, // TODO: set the repository URL once it is published
    summary:
      "An exploratory and predictive analysis of customer churn — profiling the dataset, uncovering the strongest churn drivers and training baseline classification models with honest evaluation.",
    tags: ["Python", "Pandas", "scikit-learn", "EDA"],
    caseStudy: {
      overview:
        "Churn is one of the most practical problems to learn the full analytics workflow on: messy data, unclear definitions, imbalanced classes and findings that need to translate into retention actions.",
      objectives: [
        "Profile and clean the dataset, documenting every decision",
        "Explore and visualise the strongest churn drivers",
        "Train and compare baseline classification models with cross-validation",
        "Translate the findings into simple, actionable retention ideas",
      ],
      approach:
        "Python with Pandas and NumPy for wrangling, Matplotlib and Seaborn for exploratory visuals, and scikit-learn for modelling and evaluation.",
      tools: ["Python", "Pandas", "NumPy", "Matplotlib", "scikit-learn"],
    },
  },
  {
    id: "hr-attrition-insights",
    title: "HR Attrition Insights",
    status: "planned",
    githubUrl: null, // TODO: set the repository URL once it is published
    summary:
      "A structured SQL exploration of HR data to understand attrition patterns across departments, tenure and roles — summarised in an Excel dashboard for non-technical stakeholders.",
    tags: ["SQL", "Excel", "Pivot Tables", "Dashboards"],
    caseStudy: {
      overview:
        "People data is a great exercise in asking better questions. This project explores why people leave: which departments, tenure bands and roles show unusual attrition, and what patterns are worth investigating further.",
      objectives: [
        "Write a documented set of SQL queries answering key attrition questions",
        "Identify patterns across department, tenure, role and compensation",
        "Summarise the findings in a clean Excel dashboard with clear visuals",
      ],
      approach:
        "SQL for the heavy lifting — grouping, window functions and cohort-style comparisons — then Excel pivot tables and charts for the stakeholder-facing summary.",
      tools: ["SQL", "Excel", "Pivot Tables", "Data Storytelling"],
    },
  },
  {
    id: "ai-data-assistant",
    title: "AI Data Assistant",
    status: "learning",
    githubUrl: null, // TODO: set the repository URL once it is published
    summary:
      "A learning project exploring how LLMs can help analyse data — building an assistant with LangChain and LangGraph that answers questions about a dataset using tools and a guided agent workflow.",
    tags: ["Python", "LangChain", "LangGraph", "LLMs"],
    caseStudy: {
      overview:
        "This project sits at the intersection of everything I'm currently learning: Python, machine learning foundations and the LangChain / LangGraph ecosystem. The aim is a small, auditable assistant that grounds its answers in a real dataset.",
      objectives: [
        "Understand LangChain fundamentals: prompts, chains, tools and memory",
        "Design an agent graph with LangGraph for a data Q&A workflow",
        "Ground every answer in the dataset and keep responses auditable",
      ],
      approach:
        "Python-first: LangChain for tool-calling and prompts, LangGraph for structuring the agent workflow, and Pandas as the analysis tool the agent calls.",
      tools: ["Python", "LangChain", "LangGraph", "Pandas"],
    },
  },
];
