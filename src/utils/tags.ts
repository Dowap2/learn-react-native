export const parseTags = (tags: string | null): string[] => {
  if (!tags) return [];
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
};

export const getAllTags = (posts: Array<{ tags: string | null }>): string[] => {
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    parseTags(post.tags).forEach((t) => tagSet.add(t));
  });
  return Array.from(tagSet);
};