import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { excali } from '@/fonts';

import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1
        className={`${excali.className} mt-8 mb-4 text-4xl font-bold text-gray-900`}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`${excali.className} mt-6 mb-3 text-3xl font-bold text-gray-900`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={`${excali.className} mt-5 mb-2 text-2xl font-bold text-gray-900`}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-outside list-disc space-y-2 pl-6 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-outside list-decimal space-y-2 pl-6 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-2">{children}</li>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-medium text-yellow-600 underline hover:text-yellow-700"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-yellow-400 pl-4 text-gray-600 italic">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      // Code block (inside pre tag)
      if (className?.includes('language-')) {
        return <code className={className}>{children}</code>;
      }
      // Check if it's in a pre by checking if children is a string with newlines
      const isCodeBlock =
        typeof children === 'string' && children.includes('\n');
      if (isCodeBlock) {
        // Trim the leading/trailing newlines for code blocks
        const trimmed =
          typeof children === 'string' ? children.trim() : children;
        return <code>{trimmed}</code>;
      }
      // Inline code styling
      return (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="mb-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-4 font-mono text-sm text-gray-800">
        {children}
      </pre>
    ),
    hr: () => <hr className="my-8 border-gray-300" />,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-gray-300">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border-r border-gray-300 px-4 py-2 text-left font-bold text-gray-900 last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-r border-gray-300 px-4 py-2 text-gray-700 last:border-r-0">
        {children}
      </td>
    ),
    YouTubeEmbed,
    ...components,
  };
}
