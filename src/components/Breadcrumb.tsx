import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-6 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-yellow-600 transition"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              )}
              {!isLast && <span className="ml-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
