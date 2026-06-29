# Technical Context: Kevin's Portfolio Website

## Technology Stack

### Core Framework
- **Astro.js**: Static site generator with component islands architecture
- **TypeScript**: Type-safe development with enhanced IDE support
- **Node.js**: Runtime environment for build tools and scripts

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling with custom properties and grid/flexbox
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **JavaScript/TypeScript**: Interactive components and dynamic functionality

### Component Architecture
- **Astro Components**: Server-side rendered components (.astro files)
- **React Components**: Interactive islands for dynamic functionality (.tsx files)
- **CSS Modules**: Scoped styling for component isolation

### Build and Development Tools
- **Vite**: Fast build tool and development server
- **PostCSS**: CSS processing with autoprefixer and optimization
- **ESLint**: Code linting for consistency and error prevention
- **Prettier**: Code formatting for maintainable codebase

## Development Environment

### Package Management
- **pnpm**: Fast, disk space efficient package manager
- **package.json**: Dependency management and script definitions
- **pnpm-lock.yaml**: Lock file for reproducible builds

### Version Control
- **Git**: Source code version control
- **GitHub**: Repository hosting with CI/CD workflows
- **GitHub Actions**: Automated testing and deployment

### Development Setup
- **VS Code**: Primary IDE with extensions for Astro, TypeScript
- **Node.js 18+**: Required runtime version
- **Windows Environment**: Development on Windows with PowerShell

## Deployment and Hosting

### Production Environment
- **Vercel**: Serverless deployment platform
- **CDN**: Global content delivery network
- **Edge Functions**: Server-side functionality at the edge
- **Automatic Deployments**: Git-based deployment workflow

### Performance Optimization
- **Image Optimization**: Automatic WebP/AVIF conversion and responsive images
- **Code Splitting**: Automatic bundle optimization
- **Static Generation**: Pre-rendered pages for optimal performance
- **Compression**: Gzip/Brotli compression for assets

## System Constraints

### Performance Requirements
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: 90+ across all categories
- **Bundle Size**: JavaScript bundles < 100KB gzipped
- **Image Optimization**: Modern formats with responsive sizing

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

### Accessibility Requirements
- **WCAG 2.1 AA**: Compliance with accessibility standards
- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: ARIA labels and descriptions

## External Dependencies

### Third-party Services
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Typography with performance optimization
- **Analytics**: Performance and user behavior tracking
- **Contact Forms**: Form handling and email integration

### APIs and Integrations
- **Supabase**: Authentication and database services
- **Airtable**: Content management for dynamic data
- **Social Media APIs**: Integration with professional networks

### Development Dependencies
- **@astrojs/**: Official Astro integrations and plugins
- **@types/**: TypeScript type definitions
- **Sharp**: Image processing for optimization
- **Autoprefixer**: CSS vendor prefix automation

## Security Considerations

### Data Protection
- **Environment Variables**: Secure API key management
- **HTTPS**: Encrypted data transmission
- **Content Security Policy**: XSS protection
- **Input Validation**: Form data sanitization

### Build Security
- **Dependency Scanning**: Regular security audits
- **Lock File Integrity**: Reproducible builds
- **Secrets Management**: Secure credential handling

## Monitoring and Analytics

### Performance Monitoring
- **Core Web Vitals**: Real user metrics
- **Lighthouse CI**: Automated performance testing
- **Bundle Analysis**: Code splitting effectiveness

### Error Tracking
- **Console Monitoring**: Client-side error detection
- **Build Monitoring**: CI/CD pipeline health
- **Uptime Monitoring**: Service availability tracking