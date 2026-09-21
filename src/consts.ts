import type { Metadata, Socials } from "@types";

export const SITE = {
  NAME: "Ryan Northam",
  URL: "https://ryannortham.blog",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 1,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Ryan Northam",
  DESCRIPTION:
    "Ryan Northam is a Lead Software Engineer at Mantel, based in Melbourne, Australia.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Technical writing by Ryan Northam.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Ryan Northam's professional experience.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Software and experiments built by Ryan Northam.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    LABEL: "GitHub",
    HREF: "https://github.com/ryannortham",
  },
  {
    NAME: "linkedin",
    LABEL: "LinkedIn",
    HREF: "https://www.linkedin.com/in/ryan-northam-87880245/",
  },
];
