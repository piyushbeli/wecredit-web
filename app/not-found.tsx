import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Custom 404 Not Found page with elegant illustration
 */
const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-linear-to-b from-background via-background to-muted/30">
      {/* Animated SVG Illustration */}
      <div className="relative mb-8">
        <svg
          viewBox="0 0 400 300"
          className="w-full max-w-md h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circles with subtle animation */}
          <circle
            cx="200"
            cy="150"
            r="120"
            className="fill-muted/40 animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <circle
            cx="200"
            cy="150"
            r="80"
            className="fill-muted/60"
          />
          {/* Stylized "404" text */}
          <text
            x="200"
            y="140"
            textAnchor="middle"
            className="fill-foreground font-bold"
            style={{ fontSize: '72px', fontFamily: 'system-ui' }}
          >
            404
          </text>
          {/* Decorative broken link icon */}
          <g transform="translate(160, 170)">
            <path
              d="M20 30 L35 15 M35 15 L50 15 C55 15 60 20 60 25 L60 35"
              className="stroke-muted-foreground"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M60 30 L45 45 M45 45 L30 45 C25 45 20 40 20 35 L20 25"
              className="stroke-muted-foreground"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Break indicator */}
            <line
              x1="36"
              y1="26"
              x2="44"
              y2="34"
              className="stroke-destructive"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          {/* Floating particles */}
          <circle cx="80" cy="80" r="4" className="fill-primary/30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <circle cx="320" cy="100" r="3" className="fill-primary/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          <circle cx="100" cy="220" r="5" className="fill-primary/25 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <circle cx="300" cy="200" r="4" className="fill-primary/30 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }} />
        </svg>
      </div>
      {/* Content */}
      <div className="text-center space-y-4 max-w-lg">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Oops! The page you&apos;re looking for seems to have wandered off.
          It might have been moved, deleted, or never existed.
        </p>
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button asChild size="lg">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </Button>

      </div>

    </div>
  );
};

export default NotFound;

