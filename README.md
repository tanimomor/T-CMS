# YourCMS - Modern Headless CMS for Next.js

> A powerful, developer-friendly headless CMS built exclusively for Next.js. Create content types, manage content, and build dynamic websites with an intuitive admin panel - all with built-in AI assistance.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## 🎯 Vision

Build a modern CMS that combines the power of Strapi's content modeling with a framework-first approach, enhanced by AI capabilities for content generation, optimization, and management.

## ✨ Features

### Content Management
- 🎨 **Visual Content-Type Builder** - Create content types with 14+ field types
- 📝 **Intuitive Content Manager** - Manage entries with draft/publish workflow
- 🔄 **Dynamic Zones** - Flexible content blocks for page building
- 🧩 **Reusable Components** - Build once, use everywhere
- 🔁 **Repeatable Components** - FAQ items, team members, testimonials
- 🌍 **Internationalization (i18n)** - Multi-language content support
- 📁 **Media Library** - Upload and manage assets with drag-and-drop
- 🔍 **Advanced Filtering** - Search, sort, and filter content easily

### Developer Experience
- ⚡ **Next.js 14+ Optimized** - Built for App Router and Server Components
- 🛠️ **Type-Safe API** - Full TypeScript support with auto-generated types
- 🎣 **Lifecycle Hooks** - `preSave`, `postSave`, `preDelete`, `postDelete`
- 🔌 **Plugin Architecture** - Extend functionality with custom plugins
- 📦 **Storage Adapters** - JSON files (default), MongoDB, PostgreSQL (coming soon)
- 🚀 **Framework-Ready** - Isolated `src/cms/` structure for easy updates

### AI-Powered Features 🤖
- ✍️ **AI Content Generation** - Generate content for any field type
- 🎨 **SEO Optimization** - AI-powered meta descriptions and keywords
- 🖼️ **Image Alt Text Generation** - Automatic accessibility improvements
- 📊 **Content Suggestions** - Smart recommendations based on content type
- 🌐 **Translation Assistance** - AI-assisted content localization
- 🔍 **Smart Search** - Semantic search across all content

### Publishing Workflow
- 💾 **Draft System** - Save work in progress without publishing
- ✅ **Publish/Unpublish** - Control content visibility
- 📅 **Scheduled Publishing** - Set future publish dates
- 🔄 **Version History** - Track changes and revert if needed
- 👁️ **Preview Mode** - See changes before publishing

---

## 🏗️ Architecture

### Project Structure

```
your-nextjs-project/
├── src/
│   ├── cms/                          # 🔒 CMS Framework (Do Not Modify)
│   │   ├── app/
│   │   │   └── admin/                # Admin panel routes (/admin)
│   │   │       ├── page.tsx          # Dashboard
│   │   │       ├── content-manager/  # Content management
│   │   │       ├── content-builder/  # Content type builder
│   │   │       ├── components/       # Component library
│   │   │       ├── media/            # Media library
│   │   │       └── settings/         # CMS settings
│   │   ├── components/               # CMS UI components
│   │   │   ├── ui/                   # Reusable UI elements
│   │   │   ├── forms/                # Form components
│   │   │   ├── layout/               # Sidebar, navigation
│   │   │   ├── editors/              # Field editors, WYSIWYG
│   │   │   └── builders/             # Content builders
│   │   ├── services/                 # Business logic layer
│   │   │   ├── content-type.service.ts
│   │   │   ├── component.service.ts
│   │   │   ├── entry.service.ts
│   │   │   ├── media.service.ts
│   │   │   ├── ai.service.ts         # AI integration
│   │   │   └── storage.service.ts
│   │   ├── lib/                      # Utilities & helpers
│   │   │   ├── stores/               # State management (Zustand)
│   │   │   ├── hooks/                # React hooks
│   │   │   ├── utils/                # Helper functions
│   │   │   └── types/                # TypeScript definitions
│   │   └── config/                   # CMS configuration
│   │
│   ├── app/                          # 👤 Your Website Routes
│   │   ├── page.tsx                  # Your homepage
│   │   ├── about/                    # Your pages
│   │   └── api/                      # Your API routes
│   │
│   ├── components/                   # 👤 Your Components
│   └── lib/                          # 👤 Your Utilities
│
├── cms.config.ts                     # CMS configuration file
├── cms-data/                         # Content storage (auto-generated)
└── package.json
```

### Why This Structure?

✅ **Clear Separation** - Know exactly what's framework vs your code  
✅ **No Confusion** - `src/cms/` is hands-off, everything else is yours  
✅ **Easy Updates** - Update CMS by replacing `src/cms/` folder  
✅ **No Conflicts** - Name your components anything without collision  
✅ **Framework-Ready** - Can be packaged as npm module later

---

## 🚀 Getting Started

### Installation (Coming Soon)

```bash
# Using npx (recommended)
npx create-your-cms@latest my-project
cd my-project
npm run dev

# Or clone the repository
git clone https://github.com/yourusername/your-cms.git
cd your-cms
npm install
npm run dev
```

### Access Admin Panel

Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser.

---

## 📚 Usage

### 1. Create a Content Type

```typescript
// In the admin panel: /admin/content-builder

// Example: Article content type
{
  name: "Article",
  type: "collection", // or "single"
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "uid", targetField: "title" },
    { name: "content", type: "richtext" },
    { name: "coverImage", type: "media" },
    { name: "author", type: "relation", target: "author" },
    { name: "publishedAt", type: "datetime" },
    { name: "seo", type: "component", component: "seo" }
  ]
}
```

### 2. Configure CMS (Optional)

```typescript
// cms.config.ts

export default {
  // Storage configuration
  storage: {
    type: 'json', // 'mongodb', 'postgresql' coming soon
    path: './cms-data'
  },

  // AI Configuration
  ai: {
    enabled: true,
    provider: 'openai', // or 'anthropic', 'gemini'
    apiKey: process.env.AI_API_KEY,
    features: {
      contentGeneration: true,
      seoOptimization: true,
      imageAltText: true,
      translation: true
    }
  },

  // Internationalization
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de']
  },

  // Media configuration
  media: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'video/*', 'application/pdf']
  }
}
```

### 3. Use Content in Your App

```typescript
// src/app/blog/page.tsx

import { ContentService } from '@/cms/services';

export default async function BlogPage() {
  const articleService = ContentService.for('article');
  
  // Get all published articles
  const articles = await articleService.getAll({
    filters: { status: 'published' },
    sort: { publishedAt: 'desc' },
    limit: 10
  });

  return (
    <div>
      {articles.map(article => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      ))}
    </div>
  );
}
```

### 4. Use Lifecycle Hooks

```typescript
// cms.config.ts

export default {
  contentTypes: {
    article: {
      hooks: {
        // Before saving
        preSave: async (data) => {
          // Auto-generate slug
          if (!data.slug && data.title) {
            data.slug = generateSlug(data.title);
          }
          
          // Use AI to generate SEO if empty
          if (!data.seo?.metaDescription) {
            data.seo = await aiService.generateSEO(data);
          }
          
          return data;
        },

        // After saving
        postSave: async (data) => {
          // Clear cache
          await cache.invalidate(`articles`);
          
          // Send webhook
          await sendWebhook('article.created', data);
          
          // Notify team
          await slack.notify(`New article published: ${data.title}`);
        },

        // Before deleting
        preDelete: async (id) => {
          // Check if article has comments
          const hasComments = await checkComments(id);
          if (hasComments) {
            throw new Error('Cannot delete article with comments');
          }
        },

        // After deleting
        postDelete: async (id) => {
          // Delete associated media
          await mediaService.deleteUnused();
        }
      }
    }
  }
}
```

---

## 🤖 AI Features

### Content Generation

```typescript
// In the admin panel
// Click "Generate with AI" button on any text field

// Or programmatically:
import { AIService } from '@/cms/services';

const content = await AIService.generateContent({
  contentType: 'article',
  fieldName: 'content',
  prompt: 'Write about sustainable living',
  tone: 'professional',
  length: 'medium'
});
```

### SEO Optimization

```typescript
// Auto-generate SEO metadata
const seo = await AIService.optimizeSEO({
  title: 'My Article Title',
  content: 'Article content...',
  keywords: ['sustainability', 'environment']
});

// Returns:
{
  metaTitle: 'Optimized title (60 chars)',
  metaDescription: 'Compelling description (160 chars)',
  keywords: ['relevant', 'keywords'],
  ogImage: 'suggested-image.jpg'
}
```

### Translation Assistance

```typescript
// Translate content to another locale
const translated = await AIService.translate({
  content: entry,
  fromLocale: 'en',
  toLocale: 'es',
  preserveFormatting: true
});
```

---

## 🎨 Available Field Types

1. **Text** - Short text, Long text, Rich text (WYSIWYG)
2. **Number** - Integer, Decimal, Float
3. **Date** - Date, DateTime, Time
4. **Boolean** - True/False toggle
5. **Email** - Email validation
6. **Password** - Encrypted password
7. **Enumeration** - Dropdown with custom values
8. **Media** - Single or multiple files
9. **Relation** - Link to other content types
10. **JSON** - Raw JSON data
11. **UID** - Unique identifier (auto-slug)
12. **Component** - Single-use reusable component
13. **Repeatable Component** - Multi-instance component
14. **Dynamic Zone** - Flexible content blocks

---

## 🧩 Component System

### Single-Use Components
Use once per entry (e.g., SEO, Hero Section)

```typescript
// Example: SEO Component
{
  name: "SEO",
  category: "metadata",
  repeatable: false,
  fields: [
    { name: "metaTitle", type: "text", maxLength: 60 },
    { name: "metaDescription", type: "text", maxLength: 160 },
    { name: "keywords", type: "text" },
    { name: "ogImage", type: "media" }
  ]
}
```

### Repeatable Components
Use multiple times per entry (e.g., FAQ, Team Members)

```typescript
// Example: FAQ Item Component
{
  name: "FAQ Item",
  category: "content",
  repeatable: true,
  minInstances: 1,
  maxInstances: 20,
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "richtext", required: true }
  ]
}
```

### Dynamic Zones
Mix multiple components in any order

```typescript
// Example: Page Builder
{
  name: "sections",
  type: "dynamiczone",
  components: [
    "hero-section",
    "feature-grid",
    "testimonial-slider",
    "cta-banner"
  ]
}
```

---

## 🌍 Internationalization

### Enable i18n

```typescript
// cms.config.ts
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'ja']
  }
}
```

### Create Localized Content

```typescript
// In content manager, switch locale in sidebar
// Each locale saves independently

// Get content by locale
const articles = await ContentService.for('article').getAll({
  locale: 'es'
});

// Get all locales for an entry
const entry = await ContentService.for('article').get(id, {
  includeAllLocales: true
});
```

---

## 🔌 API Reference

### ContentService

```typescript
import { ContentService } from '@/cms/services';

const service = ContentService.for('contentTypeName');

// Create
await service.create(data);

// Read
await service.get(id);
await service.getAll(options);

// Update
await service.update(id, data);

// Delete
await service.delete(id);

// Publish/Unpublish
await service.publish(id);
await service.unpublish(id);

// Bulk operations
await service.bulkDelete([id1, id2]);
await service.bulkPublish([id1, id2]);
```

### Query Options

```typescript
await service.getAll({
  filters: {
    status: 'published',
    category: 'tech',
    publishedAt: { $gte: '2024-01-01' }
  },
  sort: { publishedAt: 'desc' },
  limit: 10,
  skip: 0,
  locale: 'en',
  populate: ['author', 'category']
});
```

---

## 🛣️ Roadmap

### Phase 1: Core CMS (Current)
- [x] Admin panel UI
- [x] Content type builder
- [x] Content manager
- [x] Component library
- [x] Media library
- [x] Draft/Publish workflow
- [ ] Complete testing

### Phase 2: Framework Features
- [ ] CRUD API implementation
- [ ] Lifecycle hooks system
- [ ] Storage adapters (JSON, MongoDB, PostgreSQL)
- [ ] Type generation
- [ ] Plugin system

### Phase 3: AI Integration
- [ ] Content generation
- [ ] SEO optimization
- [ ] Image alt text generation
- [ ] Translation assistance
- [ ] Smart search

### Phase 4: Advanced Features
- [ ] Version history
- [ ] Role-based access control (RBAC)
- [ ] API token management
- [ ] Webhooks
- [ ] Scheduled publishing
- [ ] Audit logs

### Phase 5: Developer Tools
- [ ] CLI tool (`create-your-cms`)
- [ ] npm package release
- [ ] GraphQL API
- [ ] REST API auto-generation
- [ ] SDK for popular frameworks

### Phase 6: Enterprise Features
- [ ] Multi-tenancy
- [ ] Advanced caching
- [ ] CDN integration
- [ ] Performance monitoring
- [ ] Custom field types
- [ ] Marketplace for plugins

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/your-cms.git
cd your-cms

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 📖 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [Content Type Builder](docs/content-types.md)
- [Component System](docs/components.md)
- [API Reference](docs/api-reference.md)
- [Lifecycle Hooks](docs/hooks.md)
- [AI Features](docs/ai-features.md)
- [Internationalization](docs/i18n.md)
- [Deployment](docs/deployment.md)

---

## 🙏 Acknowledgments

Inspired by:
- [Strapi](https://strapi.io/) - Content type modeling and admin UI
- [Payload CMS](https://payloadcms.com/) - Developer experience
- [Directus](https://directus.io/) - Data-first approach
- [ABP Framework](https://abp.io/) - CRUD and hook patterns

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 💬 Community & Support

- 📧 Email: support@your-cms.com
- 💬 Discord: [Join our community](https://discord.gg/your-cms)
- 🐦 Twitter: [@your_cms](https://twitter.com/your_cms)
- 📝 Blog: [blog.your-cms.com](https://blog.your-cms.com)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

*Making content management simple, powerful, and AI-enhanced.*#   T - C M S  
 