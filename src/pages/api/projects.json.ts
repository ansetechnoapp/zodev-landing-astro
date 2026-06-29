import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  try {
    const projects = await getCollection('work');
    
    // Sort projects by number (same as in work page)
    const sortedProjects = projects
      .sort((a, b) => b.data.number - a.data.number)
      .map(project => ({
        slug: project.slug,
        title: project.data.title,
        number: project.data.number
      }));

    return new Response(JSON.stringify(sortedProjects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
