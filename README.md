# Next.js AI Powered Headless CMS

A modern, fully-featured CMS admin panel built with Next.js 14+, TypeScript, and Tailwind CSS. This project replicates Strapi's functionality with a beautiful, professional interface.

## 🚀 Features

- **Content Management**: Create and manage content types with flexible field configurations
- **Component Library**: Build reusable components for consistent content structures
- **Media Library**: Upload, organize, and manage media files
- **Entry Management**: Create, edit, and publish content entries with draft/publish workflow
- **Internationalization**: Multi-language support with locale management
- **Settings**: Comprehensive configuration options for your CMS
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **TypeScript**: Full type safety throughout the application
- **Local Storage**: Data persistence using browser localStorage (no backend required)

## 🏗️ Project Structure

**IMPORTANT**: This CMS follows a strict separation of concerns:

```
src/
├── cms/                          # 🔒 CMS Framework - DO NOT modify
│   ├── app/admin/                # CMS admin routes (/admin/*)
│   ├── components/               # CMS UI components
│   ├── lib/                      # CMS utilities, stores, hooks
│   ├── services/                 # CMS business logic
│   └── config/                   # CMS configuration
│
├── app/                          # 👤 User's website routes
│   ├── page.tsx                  # User's homepage
│   ├── about/                    # User's pages
│   └── admin/                    # CMS admin panel routes
│
├── components/                   # 👤 User's components
└── lib/                          # 👤 User's utilities
```

### Key Principles:
- ✅ **Clear Separation**: `src/cms/` contains all framework code
- ✅ **No Conflicts**: User code goes in `src/app/`, `src/components/`, `src/lib/`
- ✅ **Framework-Ready**: Entire `src/cms/` can be packaged as npm package
- ✅ **Easy Updates**: Replace entire `src/cms/` folder to update CMS
- ✅ **Maintainable**: Contributors know exactly where to work

## 🛠️ Technology Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form management
- **Zustand** for state management
- **Local Storage** for data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   - User Website: [http://localhost:3000](http://localhost:3000)
   - CMS Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📖 Usage Guide

### Accessing the CMS

Navigate to `/admin` to access the CMS admin panel. The system includes:

1. **Dashboard** (`/admin`) - Overview with stats and quick actions
2. **Content Manager** (`/admin/content-manager`) - Manage content entries
3. **Content-Type Builder** (`/admin/content-builder`) - Create content types
4. **Component Library** (`/admin/components`) - Manage reusable components
5. **Media Library** (`/admin/media`) - Upload and manage files
6. **Settings** (`/admin/settings`) - Configure your CMS

### Creating Content Types

1. Go to **Content-Type Builder**
2. Click **Create new content type**
3. Choose between **Single Type** or **Collection Type**
4. Configure basic settings (name, API ID, description)
5. Add fields using the field editor
6. Save your content type

### Available Field Types

- **Text Fields**: Text, Long Text, Rich Text, Email, Password
- **Numbers**: Number, Decimal, Float
- **Dates**: Date, DateTime, Time
- **Media**: Single Media, Multiple Media
- **Relations**: One-to-One, One-to-Many, Many-to-One, Many-to-Many
- **Components**: Single Component, Repeatable Component
- **Advanced**: JSON, UID, Boolean, Enumeration, Dynamic Zone

### Building Components

1. Go to **Component Library**
2. Click **Create new component**
3. Configure component settings (name, category, repeatable)
4. Add fields to your component
5. Use components in content types

### Managing Content

1. Go to **Content Manager**
2. Select a content type
3. View, create, edit, or delete entries
4. Use the draft/publish workflow
5. Search and filter entries

### Media Management

1. Go to **Media Library**
2. Upload files via drag & drop or file browser
3. Organize files in folders
4. Edit file metadata (alt text, captions)
5. Search and filter media files

## 🎨 Customization

### Styling

The CMS uses Tailwind CSS with a custom design system. Key CSS variables:

```css
:root {
  --primary: 124 58 237;        /* Purple */
  --primary-foreground: 255 255 255;
  --secondary: 99 102 241;      /* Indigo */
  --background: 255 255 255;
  --foreground: 31 41 55;
}
```

### Adding Custom Components

Create your own UI components in `src/cms/components/ui/` following the existing patterns.

### Extending Field Types

Add new field types in `src/cms/config/field-types.ts` and implement the corresponding editor components.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Customize default settings
NEXT_PUBLIC_CMS_NAME="My CMS"
NEXT_PUBLIC_DEFAULT_LOCALE="en"
```

### Settings

Configure your CMS through the Settings page:

- **General**: App name, description, timezone
- **Internationalization**: Enable i18n, manage locales
- **Roles & Permissions**: User role management
- **API Tokens**: External API access
- **Webhooks**: Real-time notifications

## 📊 Data Storage

Currently, the CMS uses browser localStorage for data persistence. This means:

- ✅ **No Backend Required**: Works entirely in the browser
- ✅ **Fast Development**: No database setup needed
- ✅ **Portable**: Easy to demo and test
- ⚠️ **Browser-Specific**: Data is tied to the browser/device
- ⚠️ **Limited Storage**: Subject to browser storage limits

### Future Backend Integration

The architecture is designed to easily integrate with a backend:

1. Replace `src/cms/services/storage.service.ts` with API calls
2. Update store actions to use async operations
3. Add authentication and authorization
4. Implement real-time updates with WebSockets

## 🧪 Development

### Project Structure Details

```
src/cms/
├── app/admin/                    # Admin panel pages
│   ├── layout.tsx               # Admin layout wrapper
│   ├── page.tsx                 # Dashboard
│   ├── content-manager/         # Content management
│   ├── content-builder/         # Content type builder
│   ├── components/              # Component library
│   ├── media/                   # Media library
│   └── settings/                # Settings pages
├── components/                   # UI components
│   ├── ui/                      # Basic UI elements
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   ├── editors/                 # Field editors
│   └── builders/                # Content builders
├── lib/                         # Utilities
│   ├── stores/                  # Zustand stores
│   ├── hooks/                   # Custom hooks
│   ├── utils/                   # Helper functions
│   ├── validators/              # Validation logic
│   └── types/                   # TypeScript types
├── services/                    # Business logic
│   ├── content-type.service.ts  # Content type operations
│   ├── component.service.ts     # Component operations
│   ├── entry.service.ts         # Entry operations
│   ├── media.service.ts         # Media operations
│   └── storage.service.ts       # Data persistence
└── config/                      # Configuration
    ├── field-types.ts           # Field type definitions
    ├── routes.ts                # Route constants
    └── constants.ts             # App constants
```

### Adding New Features

1. **New Field Type**:
   - Add to `src/cms/config/field-types.ts`
   - Create editor component in `src/cms/components/editors/`
   - Update validation in `src/cms/lib/validators/`

2. **New Page**:
   - Create page in `src/cms/app/admin/`
   - Add route to `src/cms/config/routes.ts`
   - Update navigation in `src/cms/components/layout/sidebar.tsx`

3. **New Service**:
   - Create service in `src/cms/services/`
   - Add corresponding store in `src/cms/lib/stores/`
   - Update types in `src/cms/lib/types/`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Other Platforms

The CMS works on any platform that supports Next.js:

- **Netlify**: Connect GitHub repository
- **Railway**: Deploy with one click
- **DigitalOcean App Platform**: Container-based deployment
- **AWS Amplify**: Full-stack deployment

### Environment Setup

For production, consider:

1. **Database Integration**: Replace localStorage with a real database
2. **Authentication**: Add user authentication and authorization
3. **File Storage**: Use cloud storage for media files
4. **CDN**: Serve static assets through a CDN
5. **Monitoring**: Add error tracking and analytics

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** in the `src/cms/` directory
4. **Test thoroughly** with the development server
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **TypeScript**: All code must be properly typed
- **ESLint**: Follow the project's linting rules
- **Prettier**: Code formatting is enforced
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **Testing**: Add tests for new features

### File Naming

- **Components**: PascalCase (`MyComponent.tsx`)
- **Pages**: kebab-case (`my-page.tsx`)
- **Utilities**: camelCase (`myUtility.ts`)
- **Types**: PascalCase (`MyType.ts`)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Strapi** for inspiration and feature reference
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Zustand** for simple state management

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

---

**Happy Content Managing! 🎉**