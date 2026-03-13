import { Link, useLocation } from '@tanstack/react-router';
import { BookOpen, PlusCircle, List, Heart } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm shadow-xs">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex-shrink-0">
                <img
                  src="/assets/generated/lecture-vault-logo.dim_256x256.png"
                  alt="Lecture Vault"
                  className="w-9 h-9 object-contain rounded-md"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="w-9 h-9 bg-primary/10 rounded-md items-center justify-center hidden"
                  aria-hidden="true"
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <span className="font-serif font-semibold text-lg text-foreground leading-tight block">
                  Lecture Vault
                </span>
                <span className="text-xs text-muted-foreground leading-none hidden sm:block">
                  Your recorded lectures, organized
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">My Lectures</span>
              </Link>
              <Link
                to="/add"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/add')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add Lecture</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p className="font-serif italic">Keep learning, keep growing.</p>
            <p className="flex items-center gap-1">
              Built with{' '}
              <Heart className="w-3.5 h-3.5 fill-primary text-primary mx-0.5" />
              {' '}using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'lecture-vault'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
              {' '}· © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
