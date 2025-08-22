# Smart Grocery List 🛒

A modern, intelligent grocery list application built with React 19, TypeScript, and advanced smart features. Optimized for Vercel deployment with enhanced performance and PWA capabilities.

## 🌟 Features

### Smart Organization
- **Auto-categorization**: Automatically categorizes items into logical groups (Produce, Dairy, Meat & Seafood, etc.)
- **Category-based display**: Items organized by store sections for efficient shopping
- **Progress tracking**: Real-time completion percentage for each category

### Budget Management
- **Budget setting**: Set spending limits for your shopping trips
- **Over-budget warnings**: Visual alerts when you exceed your budget
- **Price tracking**: Track total costs with detailed pricing per item

### Intelligent Suggestions
- **Shopping history**: Learns from your shopping patterns
- **Smart recommendations**: Suggests frequently purchased items not in your current list
- **Frequency tracking**: Identifies your most commonly bought items

### Progressive Web App (PWA)
- **Offline support**: Works without internet connection using service worker
- **Mobile optimized**: Native app-like experience on mobile devices
- **Fast loading**: Advanced code splitting and performance optimizations
- **Caching**: Intelligent caching for instant loading

### User Experience
- **Responsive design**: Works seamlessly on desktop and mobile devices
- **Simple & detailed modes**: Quick add or detailed item entry with quantities, units, and prices
- **Persistent storage**: Your data is saved locally and persists between sessions
- **Professional UI**: Clean, modern interface with smooth interactions
- **Error boundaries**: Graceful error handling with recovery options

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jabir-Srj/smart-grocery-list.git
   cd smart-grocery-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your preferences
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🚀 Enhanced Vercel Deployment

This project is extensively optimized for Vercel deployment with:

### Performance Optimizations
- **Advanced code splitting**: Separate chunks for components, services, and hooks
- **Tree shaking**: Eliminates unused code for smaller bundles
- **Asset optimization**: Automatic compression and caching
- **Service worker**: Offline capabilities and background sync

### Security Features
- **Security headers**: CSRF protection, content type validation
- **XSS protection**: Cross-site scripting prevention
- **Frame protection**: Clickjacking prevention
- **Referrer policy**: Privacy-focused referrer handling

### Deployment Options

#### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jabir-Srj/smart-grocery-list)

#### Option 2: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the optimized configuration

#### Option 3: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Performance Targets (Achieved)
- ✅ First Contentful Paint < 1.5s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Total Blocking Time < 300ms
- ✅ Lighthouse score > 90

## 🧪 Testing

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🛠️ Technology Stack

### Core Technologies
- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7 with advanced optimizations
- **Styling**: Modern CSS with CSS variables and responsive design
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library
- **Storage**: LocalStorage API with intelligent data management

### Performance & PWA
- **Service Worker**: Custom implementation for offline support
- **Code Splitting**: Advanced chunking strategy
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Multi-layer caching strategy

### Development Experience
- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Modern linting rules with React 19 support
- **Error Boundaries**: Comprehensive error handling
- **Environment Config**: Type-safe environment variable management

## 📱 Usage

### Adding Items
1. **Quick Add**: Type item name and press Enter
2. **Detailed Add**: Click "Detailed" to set quantity, unit, price, and category
3. **Recipe Integration**: Click "From Recipe" to search for recipes and add ingredients

### Managing Your List
- **Complete items**: Click the circle next to items when purchased
- **Edit items**: Click the edit icon to modify details
- **Delete items**: Click the trash icon to remove items
- **Clear completed**: Remove all completed items at once

### Budget Management
- Click the budget icon in the header to set your shopping budget
- Get visual warnings when you exceed your limit
- Track spending in real-time

### Offline Usage
- The app works offline thanks to service worker caching
- All data is stored locally and syncs when online
- PWA features allow installation on mobile devices

## 🏗️ Architecture

### Project Structure (Root Level)
```
smart-grocery-list/
├── src/
│   ├── components/        # React components with error boundaries
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Data services (storage, recipes)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions and configuration
│   └── test/             # Test setup and utilities
├── public/               # Static assets (PWA manifest, service worker)
├── dist/                # Built application (generated)
├── vercel.json          # Enhanced Vercel configuration
└── package.json         # Root-level dependencies and scripts
```

### Key Components
- **ErrorBoundary**: Comprehensive error handling with recovery
- **AddItemForm**: Smart form for adding new items with recipe integration
- **RecipeSearch**: Recipe discovery and search interface
- **GroceryList**: Main list display with category organization
- **GroceryItemComponent**: Individual item with editing capabilities
- **SmartSuggestions**: AI-like suggestions based on history

### Performance Features
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Optimized chunk strategy for faster loading
- **Service Worker**: Advanced caching and offline support
- **Bundle Analysis**: Optimized for minimal bundle size

## 🔧 Environment Configuration

The application supports various environment variables for customization:

```bash
# API Configuration
VITE_API_URL=https://api.edamam.com

# Service Worker (set to 'false' to disable)
VITE_ENABLE_SW=true

# Analytics (set to 'true' to enable)
VITE_ENABLE_ANALYTICS=false

# Cache timeout in milliseconds
VITE_CACHE_TIMEOUT=3600000

# Maximum shopping history items
VITE_MAX_HISTORY=1000
```

Copy `.env.example` to `.env.local` and customize as needed.

## 🌟 Smart Features Explained

### Auto-Categorization Algorithm
The app uses a keyword-based categorization system that matches item names to predefined categories:
- **Produce**: Fruits, vegetables, fresh items
- **Dairy**: Milk, cheese, yogurt, eggs
- **Meat & Seafood**: All protein sources
- **Pantry**: Dry goods, spices, canned items

### PWA Capabilities
- **Offline Support**: Full functionality without internet
- **Background Sync**: Sync data when connection is restored
- **App Installation**: Install on mobile devices like a native app
- **Push Notifications**: Future enhancement for shopping reminders

### Performance Optimizations
- **React 19 Features**: Latest React optimizations and concurrent rendering
- **Code Splitting**: Vendor, components, services, and hooks separated
- **Asset Optimization**: Images, fonts, and static assets optimized
- **Caching Strategy**: Multi-layer caching for instant loading

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📈 Future Enhancements

- [x] Recipe integration (add ingredients from recipes)
- [x] PWA support with offline capabilities
- [x] Advanced performance optimizations
- [x] Enhanced Vercel deployment configuration
- [ ] Cloud sync across devices
- [ ] Push notifications for shopping reminders
- [ ] Barcode scanning
- [ ] Store location mapping
- [ ] Price comparison across stores

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About

Built by a university student as a portfolio project to demonstrate:
- Modern React 19 development patterns
- TypeScript for comprehensive type safety
- Advanced Vercel deployment optimizations
- PWA development with service workers
- Performance optimization techniques
- Professional UI/UX design with error handling
- Test-driven development
- Clean, maintainable code architecture

---

**Smart Grocery List** - Making grocery shopping smarter with modern web technologies! 🛒✨
