# Wedding Organizer

Modern wedding planning application built with Next.js 15, TypeScript, and MongoDB. Manage multiple wedding projects, track guests, and organize budgets all in one place.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wedding-organizer)

## Features

### 🎯 Multi-Project Management
- Create and manage multiple wedding projects
- Shareable project URLs for easy collaboration
- Complete data isolation between projects
- Project dashboard with couple information and wedding date

### 👥 Guest Management
- Full CRUD operations for wedding guests
- Partner linking with bidirectional relationships
- Category assignment: Groom's side, Bride's side, or Both
- Role designation: Guest, Groomsman, or Bridesmaid
- Real-time statistics (total guests, couples, wedding party)
- Inline editing and click-to-cycle categories
- Search and filter by name or category
- Export to CSV (Excel-compatible with UTF-8 BOM)
- Import/Export via JSON with metadata

### 💰 Budget Management
- Track budgets from multiple venues
- Inline item management per budget
- Automatic total calculations
- Grand total across all budgets
- Sort by price, name, or date
- Search and filter by venue name
- Brazilian Real (R$) currency formatting

### ✨ User Experience
- Modern, responsive design with Tailwind CSS
- Real-time updates with optimistic UI
- Toast notifications for all operations
- Error boundaries with retry functionality
- Loading states and smooth transitions
- Mobile-friendly interface

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Database:** MongoDB with Mongoose
- **State Management:** TanStack Query (React Query v5)
- **Validation:** Zod
- **Forms:** React Hook Form
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with shadcn/ui patterns
- **Notifications:** Sonner

## Getting Started

### Prerequisites

- Node.js 20 or higher
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wedding-organizer.git
cd wedding-organizer
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run unit and integration tests |
| `npm run test:e2e` | Run end-to-end tests |

## Project Structure

```
wedding-organizer/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── project/[projectId]/  # Dynamic project routes
│   │   │   ├── guests/       # Guest management page
│   │   │   ├── budgets/      # Budget management page
│   │   │   └── page.tsx      # Project dashboard
│   │   └── page.tsx          # Landing page
│   ├── actions/              # Server Actions
│   ├── components/           # React components
│   │   ├── budgets/         # Budget components
│   │   ├── guests/          # Guest components
│   │   ├── layout/          # Header, navigation
│   │   ├── projects/        # Project components
│   │   └── providers/       # Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and database
│   ├── models/              # Mongoose models
│   ├── schemas/             # Zod validation schemas
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `FRONTEND_ORIGIN` | Frontend URL for CORS | No |
| `PORT` | Custom port (defaults to 3000) | No |

See `.env.example` for a complete template.

## Deployment

### Deploy to Vercel

1. Click the "Deploy with Vercel" button above, or:

2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Vercel (recommended)
- Netlify
- Railway
- Render
- AWS Amplify

Ensure you set the `MONGODB_URI` environment variable in your deployment platform.

## Architecture Highlights

- **Type Safety:** End-to-end TypeScript with strict mode enabled
- **Server Actions:** Type-safe RPC-style API with `'use server'` directive
- **React Query:** Automatic caching, revalidation, and optimistic updates
- **Validation:** Runtime validation with Zod on both client and server
- **Error Handling:** Comprehensive error boundaries with retry functionality
- **Security:** CSP headers, HSTS, XSS protection, input sanitization
- **Performance:** React Suspense, code splitting, optimized bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for your own wedding planning needs.

## Acknowledgments

Built with modern web technologies and best practices for type safety, performance, and user experience.

---

**Made with ❤️ for couples planning their perfect day**
