const pageCatalog = [
  {
    route: "/",
    file: "01-home.md",
    label: "Home",
    subtitle:
      "Building AI products that turn customer pain into scalable support, search, and automation experiences.",
    aliases: ["01-home.md", "home.md"]
  },
  {
    route: "/about",
    file: "02-about.md",
    label: "About",
    subtitle: "Professional background and technical focus areas.",
    aliases: ["02-about.md", "about.md"]
  },
  {
    route: "/ai-leadership-brief",
    file: "13-ai-leadership-brief.md",
    label: "AI Leadership Brief",
    subtitle: "How I lead AI product and engineering from strategy to measurable outcomes.",
    aliases: ["13-ai-leadership-brief.md", "ai-leadership-brief.md", "leadership-brief.md"]
  },
  {
    route: "/experience",
    file: "03-experience.md",
    label: "Experience",
    subtitle: "Cross-company engineering journey from enterprise to AI product platforms.",
    aliases: ["03-experience.md", "experience.md"]
  },
  {
    route: "/projects/copilot-customer-support",
    file: "04-project-copilot-customer-support.md",
    label: "Copilot for Customer Support",
    subtitle: "AI-assisted support workflows, case intelligence, and guided resolution.",
    aliases: [
      "04-project-copilot-customer-support.md",
      "project-copilot-customer-support.md"
    ]
  },
  {
    route: "/projects/alexa-smart-home",
    file: "05-project-alexa-smart-home.md",
    label: "Alexa Smart Home Registrations",
    subtitle: "Customer onboarding and reliability-focused smart home setup experiences.",
    aliases: ["05-project-alexa-smart-home.md", "project-alexa-smart-home.md"]
  },
  {
    route: "/projects/kiara-db",
    file: "06-project-kiara-db.md",
    label: "Kiara DB",
    subtitle: "In-memory static NoSQL search architecture with research backing.",
    aliases: ["06-project-kiara-db.md", "project-kiara-db.md"]
  },
  {
    route: "/projects/agent-alina",
    file: "07-project-agent-alina.md",
    label: "Agent Alina",
    subtitle: "AI chatbot for travel discovery and booking behavior optimization.",
    aliases: ["07-project-agent-alina.md", "project-agent-alina.md"]
  },
  {
    route: "/projects/kiara-usage",
    file: "-kiara-usage",
    label: "Kiara Usage Guide",
    subtitle: "Beginner-friendly onboarding plus advanced Kiara DB capabilities.",
    aliases: ["-kiara-usage", "-kiara-usage.md", "-kiara usage.md", "kiara-usage"]
  },
  {
    route: "/publications",
    file: "08-publications.md",
    label: "Research and Publications",
    subtitle: "Peer-reviewed publication and connected open-source project work.",
    aliases: ["08-publications.md", "publications.md"]
  },
  {
    route: "/resume",
    file: "10-resume.md",
    label: "Resume",
    subtitle: "Compact resume view with highlights, experience, and skills.",
    aliases: ["10-resume.md", "resume.md"]
  },
  {
    route: "/contact",
    file: "11-contact.md",
    label: "Contact",
    subtitle: "Collaboration, speaking, and engineering opportunities.",
    aliases: ["11-contact.md", "contact.md"]
  }
];

const nodes = {
  content: document.getElementById("content"),
  routeLabel: document.getElementById("route-label"),
  pageTitle: document.getElementById("page-title"),
  pageSubtitle: document.getElementById("page-subtitle"),
  menuToggle: document.getElementById("menu-toggle"),
  sidebar: document.getElementById("sidebar")
};

const cache = new Map();
const routeMap = new Map(pageCatalog.map((entry) => [entry.route, entry]));
const aliasMap = buildAliasMap();

function buildAliasMap() {
  const map = new Map();

  for (const page of pageCatalog) {
    const candidates = [page.file, ...page.aliases];
    for (const candidate of candidates) {
      map.set(normalizeRef(candidate), page.route);
      map.set(normalizeRef(`./${candidate}`), page.route);
    }
  }

  return map;
}

function normalizeRef(value) {
  return decodeURIComponent((value || "").trim())
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^#/, "")
    .replace(/\?.*$/, "")
    .replace(/#.*$/, "")
    .toLowerCase();
}

function getRouteFromHash() {
  if (!window.location.hash.startsWith("#/")) {
    return "/";
  }

  const route = window.location.hash.slice(1);
  return routeMap.has(route) ? route : "/";
}

async function fetchMarkdown(fileName) {
  if (cache.has(fileName)) {
    return cache.get(fileName);
  }

  const response = await fetch(fileName, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Could not load ${fileName}`);
  }

  const markdown = await response.text();
  cache.set(fileName, markdown);
  return markdown;
}

function stripFrontMatter(raw) {
  const frontMatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/;
  const match = raw.match(frontMatterRegex);

  if (!match) {
    return { frontMatter: {}, markdown: raw };
  }

  const parsed = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^"|"$/g, "");
    parsed[key] = value;
  }

  return {
    frontMatter: parsed,
    markdown: raw.replace(frontMatterRegex, "")
  };
}

function rewriteAnchorLinks(scope) {
  const links = scope.querySelectorAll("a[href]");

  for (const link of links) {
    const href = link.getAttribute("href");
    if (!href) {
      continue;
    }

    if (href.startsWith("http://") || href.startsWith("https://")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      continue;
    }

    if (href.startsWith("#")) {
      continue;
    }

    const normalized = normalizeRef(href);
    const mappedRoute = aliasMap.get(normalized);

    if (mappedRoute) {
      link.setAttribute("href", `#${mappedRoute}`);
    }
  }
}

function enhanceEmbeds(scope) {
  const wistiaLinks = scope.querySelectorAll('a[href*="wistia.com/medias/"]');

  for (const link of wistiaLinks) {
    const href = link.getAttribute("href") || "";
    const mediaIdMatch = href.match(/\/medias\/([a-zA-Z0-9]+)/);
    if (!mediaIdMatch) {
      continue;
    }

    const container = document.createElement("div");
    container.className = "video-embed";

    const iframe = document.createElement("iframe");
    iframe.src = `https://fast.wistia.net/embed/iframe/${mediaIdMatch[1]}`;
    iframe.title = "Project demo video";
    iframe.loading = "lazy";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");

    container.appendChild(iframe);

    const insertionParent = link.closest("p, li, div") || link.parentElement;
    if (!insertionParent || insertionParent.nextElementSibling?.classList.contains("video-embed")) {
      continue;
    }

    insertionParent.insertAdjacentElement("afterend", container);
  }
}

function activateSidebar(route) {
  const links = nodes.sidebar.querySelectorAll("a[data-route]");
  for (const link of links) {
    link.classList.toggle("active", link.dataset.route === route);
  }
}

function animateContent() {
  nodes.content.classList.remove("reveal");
  requestAnimationFrame(() => {
    nodes.content.classList.add("reveal");
  });
}

async function renderRoute(route) {
  const page = routeMap.get(route) || routeMap.get("/");
  if (!page) {
    return;
  }

  nodes.content.innerHTML = '<p class="loading">Loading content...</p>';
  nodes.routeLabel.textContent = page.route === "/" ? "Public Portfolio" : "Portfolio Section";
  nodes.pageTitle.textContent = page.label;
  nodes.pageSubtitle.textContent = page.subtitle;

  try {
    const rawMarkdown = await fetchMarkdown(page.file);
    const { frontMatter, markdown } = stripFrontMatter(rawMarkdown);
    const parsedHtml = marked.parse(markdown, {
      gfm: true,
      breaks: false,
      mangle: false,
      headerIds: true
    });

    nodes.pageTitle.textContent = frontMatter.title || page.label;
    nodes.pageSubtitle.textContent = frontMatter.description || page.subtitle;

    const cleanHtml = DOMPurify.sanitize(parsedHtml);
    nodes.content.innerHTML = cleanHtml;
    rewriteAnchorLinks(nodes.content);
    enhanceEmbeds(nodes.content);
    activateSidebar(page.route);
    animateContent();
  } catch (error) {
    nodes.content.innerHTML =
      '<p class="error">This page is not available right now. Please check file paths and try again.</p>';
    console.error(error);
  }
}

function onRouteChange() {
  const route = getRouteFromHash();
  renderRoute(route);
  nodes.sidebar.classList.remove("is-open");
}

function initMobileMenu() {
  nodes.menuToggle.addEventListener("click", () => {
    nodes.sidebar.classList.toggle("is-open");
  });

  document.addEventListener("click", (event) => {
    const clickInsideMenu = nodes.sidebar.contains(event.target);
    const clickButton = nodes.menuToggle.contains(event.target);
    if (!clickInsideMenu && !clickButton) {
      nodes.sidebar.classList.remove("is-open");
    }
  });
}

function bootstrap() {
  if (!window.location.hash) {
    window.location.hash = "#/";
  }

  initMobileMenu();
  window.addEventListener("hashchange", onRouteChange);
  onRouteChange();
}

window.addEventListener("DOMContentLoaded", bootstrap);
