# Relateful Arts GBG

A community platform for connecting artists, facilitators, and creative communities in Gothenburg, Sweden. Built with modern web technologies to foster meaningful connections and artistic collaboration.

## Features

- **Community Events**: Discover and join creative events and workshops
- **Facilitator Profiles**: Connect with experienced facilitators and artists
- **Resource Sharing**: Access and contribute to a shared knowledge base
- **Venue Directory**: Find and submit creative spaces and venues
- **User Management**: Secure authentication and profile management
- **Admin Panel**: Comprehensive tools for community moderation

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/relateful-arts-gbg.git
   cd relateful-arts-gbg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes |
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Yes |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components and routing
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── lib/           # Utility functions and helpers
└── assets/        # Static assets and images
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for the creative community of Gothenburg
