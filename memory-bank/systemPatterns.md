# System Patterns: Kevin's Portfolio Website

## Architectural Decisions

### Static Site Generation (SSG) Pattern
- **Decision**: Use Astro.js for static site generation with component islands
- **Rationale**: Optimal performance, SEO benefits, and reduced server costs
- **Implementation**: Pre-rendered pages with selective hydration for interactive components
- **Trade-offs**: Build-time generation vs. runtime flexibility

### Component Islands Architecture
- **Pattern**: Selective hydration of interactive components
- **Benefits**: Minimal JavaScript bundle, improved performance
- **Usage**: React components for forms, toggles, and dynamic interactions
- **Location**: `src/components/reactJS/` for interactive islands

### File-based Routing
- **Pattern**: Astro's file-system based routing
- **Structure**: `src/pages/` directory maps to URL structure
- **Dynamic Routes**: `[slug].astro` for parameterized pages
- **API Routes**: `src/pages/api/` for serverless functions

## Design Pattern Implementations

### Layout Pattern
- **Base Layout**: `src/layouts/Layout.astro` as the main template
- **Composition**: Slot-based content injection
- **Reusability**: Shared header, footer, and meta components
- **Responsive**: Mobile-first design with breakpoint consistency

### Component Composition Pattern
- **Atomic Design**: Small, reusable components building larger features
- **Props Interface**: TypeScript interfaces for component contracts
- **Slot Pattern**: Flexible content areas in Astro components
- **Example**: `Hero.astro` composed of `heroCounter.astro` and `heroMediaSocialNav.astro`

### Content Management Pattern
- **Static Data**: JSON files in `src/data/` for structured content
- **Content Collections**: Astro's content API for blog posts and projects
- **Type Safety**: TypeScript schemas for content validation
- **Separation**: Content separated from presentation logic

### Styling Architecture
- **Utility-First**: Tailwind CSS for rapid development
- **Component Styles**: Scoped CSS for complex components
- **Global Styles**: `src/styles/global.css` for base styles
- **Theme System**: CSS custom properties for consistent theming

## Component Architecture

### Core Components Structure
```
src/components/
├── Layout Components (Nav, Footer, Hero)
├── Content Components (About, Services, Contact)
├── UI Components (Card, Grid, ThemeToggle)
├── Interactive Components (reactJS/)
└── Specialized Components (SEO, OptimizedImage)
```

### Component Responsibilities
- **Presentation Components**: Pure display logic without state
- **Container Components**: Data fetching and state management
- **Layout Components**: Page structure and navigation
- **Utility Components**: Reusable UI elements and helpers

### Props and Interface Patterns
- **TypeScript Interfaces**: Defined in component files or separate types
- **Default Props**: Sensible defaults for optional properties
- **Validation**: Runtime validation for critical props
- **Documentation**: JSDoc comments for component APIs

## Critical System Pathways

### Page Rendering Pipeline
1. **Route Resolution**: File-based routing determines component
2. **Data Fetching**: Static data loaded at build time
3. **Component Rendering**: Server-side rendering of Astro components
4. **Hydration**: Selective hydration of interactive islands
5. **Optimization**: Image optimization and asset bundling

### Image Optimization Pipeline
1. **Source Images**: Original images in `public/assets/`
2. **Processing**: Sharp-based optimization during build
3. **Format Generation**: WebP/AVIF variants with fallbacks
4. **Responsive Images**: Multiple sizes for different viewports
5. **Lazy Loading**: Intersection Observer for performance

### SEO Generation Pipeline
1. **Meta Tags**: Dynamic generation based on page content
2. **Sitemap**: Automated sitemap.xml generation
3. **Schema Markup**: Structured data for rich snippets
4. **Open Graph**: Social media preview optimization
5. **Performance**: Core Web Vitals optimization

### Build and Deployment Pipeline
1. **Development**: Local development with hot reload
2. **Type Checking**: TypeScript compilation and validation
3. **Linting**: ESLint and Prettier for code quality
4. **Testing**: Automated testing for critical functionality
5. **Build**: Static site generation with optimization
6. **Deployment**: Vercel deployment with edge distribution

## State Management Patterns

### Client-Side State
- **React State**: useState and useEffect for interactive components
- **Local Storage**: Theme preferences and user settings
- **URL State**: Query parameters for shareable states
- **Form State**: Controlled components for form handling

### Global State
- **CSS Custom Properties**: Theme and design tokens
- **Astro Global**: Build-time global data access
- **Context Providers**: React context for shared state
- **Environment Variables**: Configuration and API keys

## Error Handling Patterns

### Build-Time Errors
- **TypeScript**: Compile-time type checking
- **Content Validation**: Schema validation for content collections
- **Asset Validation**: Image and file existence checks
- **Link Validation**: Internal link integrity checks

### Runtime Errors
- **Error Boundaries**: React error boundaries for component failures
- **Graceful Degradation**: Fallbacks for failed components
- **404 Handling**: Custom 404 page with navigation
- **Form Validation**: Client and server-side validation

## Performance Patterns

### Loading Optimization
- **Critical CSS**: Inline critical styles for above-fold content
- **Resource Hints**: Preload, prefetch for critical resources
- **Code Splitting**: Automatic splitting by Astro and Vite
- **Tree Shaking**: Unused code elimination

### Caching Strategy
- **Static Assets**: Long-term caching with content hashing
- **HTML Pages**: CDN caching with appropriate headers
- **API Responses**: Cache-Control headers for dynamic content
- **Service Worker**: Offline functionality and caching

### Monitoring and Analytics
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Client-side error reporting
- **User Analytics**: Privacy-focused user behavior tracking
- **Build Metrics**: Bundle size and build time monitoring