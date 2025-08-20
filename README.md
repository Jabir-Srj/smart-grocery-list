# Smart Grocery List 🛒

A modern, intelligent grocery list application built with React, TypeScript, and advanced smart features. Perfect for managing your shopping efficiently while staying within budget.

![Smart Grocery List Demo](demo-screenshot.png)

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

### User Experience
- **Responsive design**: Works seamlessly on desktop and mobile devices
- **Simple & detailed modes**: Quick add or detailed item entry with quantities, units, and prices
- **Persistent storage**: Your data is saved locally and persists between sessions
- **Professional UI**: Clean, modern interface with smooth interactions

### Item Management
- **Flexible quantities**: Support for various units (lbs, oz, gallons, pieces, etc.)
- **Price per item**: Optional pricing for budget tracking
- **Custom categories**: Override auto-categorization when needed
- **Notes support**: Add additional notes to items
- **Edit in-place**: Modify items directly in the list

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
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm test
```

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules with modern CSS features
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library
- **Storage**: LocalStorage API
- **State Management**: React Hooks (useState, useEffect, custom hooks)

## 📱 Usage

### Adding Items
1. **Quick Add**: Type item name and press Enter
2. **Detailed Add**: Click "Detailed" to set quantity, unit, price, and category
3. **Recipe Integration**: Click "From Recipe" to search for recipes and add ingredients

### Recipe Integration
- **Search Recipes**: Find recipes from trusted cooking sources
- **View Details**: See ingredients, instructions, cooking time, and servings
- **Select Ingredients**: Choose which ingredients to add to your list
- **Automatic Categorization**: Ingredients are automatically sorted into appropriate categories

### Managing Your List
- **Complete items**: Click the circle next to items when purchased
- **Edit items**: Click the edit icon to modify details
- **Delete items**: Click the trash icon to remove items
- **Clear completed**: Remove all completed items at once

### Budget Management
- Click the budget icon in the header to set your shopping budget
- Get visual warnings when you exceed your limit
- Track spending in real-time

### Smart Features
- The app learns from your shopping history
- Get suggestions for frequently bought items
- Items are automatically categorized for efficient shopping

## 🏗️ Architecture

### Project Structure
```
frontend/
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Data services (storage)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── test/             # Test setup and utilities
├── public/               # Static assets
└── dist/                # Built application
```

### Key Components
- **AddItemForm**: Smart form for adding new items with recipe integration
- **RecipeSearch**: Recipe discovery and search interface
- **RecipeModal**: Detailed recipe view with ingredient selection
- **GroceryList**: Main list display with category organization
- **GroceryItemComponent**: Individual item with editing capabilities
- **SmartSuggestions**: AI-like suggestions based on history

### Custom Hooks
- **useGroceryList**: Main state management for the grocery list
- Handles all CRUD operations, persistence, and smart features
- Supports batch addition of items for recipe integration

## 🌟 Smart Features Explained

### Auto-Categorization Algorithm
The app uses a keyword-based categorization system that matches item names to predefined categories:
- **Produce**: Fruits, vegetables, fresh items
- **Dairy**: Milk, cheese, yogurt, eggs
- **Meat & Seafood**: All protein sources
- **Pantry**: Dry goods, spices, canned items
- And more...

### Shopping History & Suggestions
- Tracks completed items and purchase frequency
- Generates suggestions based on items you buy regularly
- Learns your shopping patterns over time

### Budget Intelligence
- Real-time cost calculation
- Visual budget warnings
- Spending breakdown by category

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📈 Future Enhancements

- [x] Recipe integration (add ingredients from recipes)
- [ ] Store location mapping
- [ ] Nutritional information database
- [ ] Cloud sync across devices
- [ ] Shopping list sharing
- [ ] Barcode scanning
- [ ] Price comparison across stores
- [ ] Meal planning integration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About

Built by a university student as a portfolio project to demonstrate:
- Modern React development patterns
- TypeScript for type safety
- Smart algorithms and data structures
- Professional UI/UX design
- Test-driven development
- Clean code architecture

---

**Smart Grocery List** - Making grocery shopping smarter, one item at a time! 🛒✨