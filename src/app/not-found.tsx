import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-shell section-padding">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
        <p className="section-kicker">Page Not Found</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">We couldn&apos;t find the page you&apos;re looking for.</h1>
        <p className="mt-4 text-slate-600">Try heading back to the homepage or get in touch if you need help finding a specific service or sector page.</p>
        <Link href="/" className="button-primary mt-8">
          Return Home
        </Link>
      </div>
    </div>
  );
}
