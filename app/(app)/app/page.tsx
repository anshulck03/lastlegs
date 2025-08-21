import { Suspense } from "react";
import { requireUser } from "../../../lib/auth/requireUser";

// Skeleton component for loading states
function RaceSummarySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-[color:var(--bg-1)] rounded-lg p-6 border border-[color:var(--line)]">
        <div className="h-6 bg-[color:var(--bg-2)] rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[color:var(--bg-2)] rounded w-full"></div>
          <div className="h-4 bg-[color:var(--bg-2)] rounded w-5/6"></div>
          <div className="h-4 bg-[color:var(--bg-2)] rounded w-4/6"></div>
        </div>
        <div className="mt-6 flex space-x-4">
          <div className="h-10 bg-[color:var(--bg-2)] rounded w-24"></div>
          <div className="h-10 bg-[color:var(--bg-2)] rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyRaceState() {
  return (
    <div className="text-center py-12">
      <div className="bg-[color:var(--bg-1)] rounded-lg p-8 border border-[color:var(--line)]">
        <div className="mb-6">
          <div className="w-16 h-16 bg-[color:var(--bg-2)] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-[color:var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--text-1)] mb-2">
            Ready to Start Training?
          </h3>
          <p className="text-[color:var(--text-2)] mb-6">
            Pick a race to generate your personalized AI training plan
          </p>
        </div>
        <a 
          href="/onboarding"
          className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium"
        >
          Choose Your Race
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// Server component for fetching user race data
async function RaceSummary() {
  // Simulate checking for user race selection
  // In a real implementation, this would query the database
  const hasRaceSelection = false; // TODO: Replace with actual DB query when available
  
  if (!hasRaceSelection) {
    return <EmptyRaceState />;
  }

  // TODO: Replace with actual race data when available
  return (
    <div className="bg-[color:var(--bg-1)] rounded-lg p-6 border border-[color:var(--line)]">
      <h2 className="text-xl font-semibold text-[color:var(--text-1)] mb-4">
        Your Training Plan
      </h2>
      <p className="text-[color:var(--text-2)]">
        Race data and training plan will appear here when available.
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  // TODO: Uncomment when auth is ready
  // const user = await requireUser(/* request object */);
  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <div className="min-h-screen bg-[color:var(--bg-0)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--text-1)] mb-2">
            Dashboard
          </h1>
          <p className="text-[color:var(--text-2)]">
            Your AI-powered Ironman training hub
          </p>
        </div>

        <div className="grid gap-6">
          <Suspense fallback={<RaceSummarySkeleton />}>
            <RaceSummary />
          </Suspense>
        </div>
      </div>
    </div>
  );
}