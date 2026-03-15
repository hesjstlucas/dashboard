export function createGuidelineLink(seed = {}) {
  return {
    id:
      typeof seed.id === "string" && seed.id
        ? seed.id
        : `gl${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
    label:
      typeof seed.label === "string" && seed.label.trim() ? seed.label : "Website button",
    url: typeof seed.url === "string" && seed.url.trim() ? seed.url : "https://"
  };
}

export function normalizeGuidelineEntry(entry, index = 0) {
  const id =
    typeof entry?.id === "string" && entry.id.trim() ? entry.id : `guideline-${index + 1}`;

  return {
    id,
    title:
      typeof entry?.title === "string" && entry.title.trim()
        ? entry.title
        : `Guideline ${index + 1}`,
    content: typeof entry?.content === "string" ? entry.content : "",
    links: Array.isArray(entry?.links)
      ? entry.links.map((link, linkIndex) =>
          createGuidelineLink({
            ...link,
            id:
              typeof link?.id === "string" && link.id.trim()
                ? link.id
                : `${id}-link-${linkIndex + 1}`
          })
        )
      : []
  };
}

export function normalizeGuidelines(entries) {
  return Array.isArray(entries) ? entries.map(normalizeGuidelineEntry) : [];
}

export function toExternalUrl(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}
