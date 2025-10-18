import { excali } from "@/fonts";

interface CalculatorInfoProps {
  title: string;
  items: React.ReactNode[];
}

export function CalculatorInfo({ title, items }: CalculatorInfoProps) {
  return (
    <article className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h2 className={`${excali.className} text-xl mb-3 text-blue-900`}>
        {title}
      </h2>
      <ul className="space-y-2 text-sm text-blue-900">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
