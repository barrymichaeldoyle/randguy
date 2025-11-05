# Blog Posts

This directory contains all blog posts written in MDX format.

## Adding a New Blog Post

### 1. Create a new `.mdx` file

Create a new file in this directory, e.g., `my-new-post.mdx`

### 2. Add metadata at the top

Every post must export metadata:

```jsx
export const metadata = {
  title: 'Your Post Title',
  date: '2025-10-12',
  description: 'A brief description for SEO and the blog listing page.',
};
```

### 3. Write your content

Use standard Markdown syntax. **Note:** Don't add an H1 (`#`) heading - the page template automatically displays the title from metadata.

```markdown
Your intro paragraph here.

## Subheading

- Bullet points
- Are supported

### Smaller heading

**Bold text** and _italic text_ work too.

> Blockquotes look great for callouts

[Links work](https://example.com)
```

### 4. Update the blog listing

Edit `/src/app/blog/page.tsx` and add your post to the `posts` array:

```typescript
const posts: BlogPost[] = [
  {
    slug: 'my-new-post', // Must match the filename (without .mdx)
    title: 'Your Post Title',
    date: '2025-10-12',
    description: 'Brief description here.',
  },
  // ... other posts
];
```

### 5. Test it

Run `pnpm dev` and navigate to:

- Listing: http://localhost:3000/blog
- Your post: http://localhost:3000/blog/my-new-post

## Tips

- Use descriptive slug names (e.g., `understanding-retirement-annuities`)
- Keep metadata descriptions under 160 characters for SEO
- Use dates in YYYY-MM-DD format
- The MDX components are styled automatically (see `/src/mdx-components.tsx`)

## Future Improvements

Consider these enhancements:

1. ✅ **Automate the listing** - Use `fs` to read all MDX files dynamically
2. **Add tags/categories** - Group posts by topic
3. **Add author info** - If you have multiple authors
4. **Generate RSS feed** - Using the `feed` package
5. ✅ **Add reading time** - Calculate from word count
6. **Add social sharing** - Twitter, LinkedIn buttons
