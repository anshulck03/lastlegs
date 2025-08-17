import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28 text-center">
      <h1 className="text-3xl font-bold text-[color:var(--text-1)]">
        Page not found.
      </h1>
      <p className="mt-2 text-[color:var(--text-2)]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="mt-6">
        <Link href="/" className="btn-primary inline-flex">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
