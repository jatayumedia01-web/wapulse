import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="font-serif text-8xl font-bold text-gold">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-navy sm:text-3xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-gray-text">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="btn-gold mt-8 rounded px-8 py-3.5 text-sm">
        BACK TO HOME
      </Link>
    </div>
  );
}
