import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { CALCULATORS } from '@/lib/site-data';

export default function CalculatorsNotFound() {
  return (
    <div className="min-h-[70vh] w-full max-w-4xl px-4 pt-8 pb-8 md:px-8 md:pt-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link href="/" className="transition hover:text-yellow-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/calculators"
              className="transition hover:text-yellow-600"
            >
              Calculators
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-900" aria-current="page">
            404
          </li>
        </ol>
      </nav>

      <div className="mb-12 text-center">
        <Image
          src="/RandGuyLogo.png"
          alt="Rand Guy logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className={`${excali.className} mb-4 text-6xl text-yellow-600`}>
          404
        </h1>
        <h2 className={`${excali.className} mb-4 text-4xl`}>
          Calculator Not Found
        </h2>
        <p className="mb-6 text-lg text-gray-600">
          Sorry, the calculator you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button href="/calculators" variant="primary" size="md">
          View All Calculators
        </Button>
      </div>

      <section>
        <h3 className={`${excali.className} mb-6 text-center text-2xl`}>
          Available Calculators
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CALCULATORS.map((calculator) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-6 text-center shadow-sm transition-all hover:border-yellow-400 hover:shadow-md"
            >
              <div className="mb-3 text-4xl" aria-hidden="true">
                {calculator.icon}
              </div>
              <h4 className="font-semibold text-gray-900">
                {calculator.title}
              </h4>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
