/**
 * This file exports the blog post data from JSON files
 * It replaces the getCollection functionality from Astro content collections
 */

import allPosts from './all-posts.json';

/**
 * Get all blog posts
 * @returns {Array} Array of blog post objects
 */
export function getAllPosts() {
  // Sort posts by date (newest first)
  return [...allPosts].sort((a, b) => {
    return new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf();
  });
}

/**
 * Get a single blog post by slug
 * @param {string} slug - The slug of the post to retrieve
 * @returns {Object|null} The post object or null if not found
 */
export function getPostBySlug(slug) {
  return allPosts.find(post => post.slug === slug) || null;
}

/**
 * Get all unique tags from blog posts
 * @returns {Array} Array of unique tag strings
 */
export function getAllTags() {
  const tags = allPosts.flatMap(post => post.tags || []);
  return [...new Set(tags)];
}

/**
 * Get posts by tag
 * @param {string} tag - The tag to filter by
 * @returns {Array} Array of post objects with the specified tag
 */
export function getPostsByTag(tag) {
  return getAllPosts().filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

/**
 * Helper function to parse dates from ISO strings
 * @param {Object} post - The post object
 * @returns {Object} Post with parsed Date objects
 */
export function parsePostDates(post) {
  if (!post) return null;

  return {
    ...post,
    pubDate: new Date(post.pubDate),
    updatedDate: post.updatedDate ? new Date(post.updatedDate) : undefined
  };
}

/**
 * Get all unique categories from blog posts
 * @returns {Array} Array of unique category strings
 */
export function getAllCategories() {
  const categories = allPosts.flatMap(post => post.tags || []);
  return [...new Set(categories)].sort();
}

/**
 * Get related posts based on shared tags
 * @param {Object} currentPost - The current post object
 * @param {number} limit - Maximum number of related posts to return
 * @returns {Array} Array of related post objects
 */
export function getRelatedPosts(currentPost, limit = 3) {
  if (!currentPost || !currentPost.tags) return [];

  const currentTags = currentPost.tags;
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);

  // Calculate relevance score based on shared tags
  const postsWithScore = otherPosts.map(post => {
    const postTags = post.tags || [];
    const sharedTags = currentTags.filter(tag => postTags.includes(tag));
    return {
      ...post,
      relevanceScore: sharedTags.length
    };
  });

  // Sort by relevance score (descending) and then by date (newest first)
  const sortedPosts = postsWithScore
    .filter(post => post.relevanceScore > 0)
    .sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf();
    });

  // If we don't have enough related posts, fill with recent posts
  if (sortedPosts.length < limit) {
    const recentPosts = otherPosts
      .filter(post => !sortedPosts.find(sp => sp.slug === post.slug))
      .sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
      .slice(0, limit - sortedPosts.length);

    sortedPosts.push(...recentPosts);
  }

  return sortedPosts.slice(0, limit).map(parsePostDates);
}

/**
 * Get previous and next posts relative to a given slug
 * @param {string} currentSlug - The slug of the current post
 * @returns {{ prev: Object|null, next: Object|null }}
 */
export function getAdjacentPosts(currentSlug) {
  const sorted = getAllPosts();
  const index = sorted.findIndex(post => post.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    next: index > 0 ? sorted[index - 1] : null,
    prev: index < sorted.length - 1 ? sorted[index + 1] : null
  };
}
