'use client';

import { Children, useState, type ReactNode } from 'react';

interface SearchablePost {
  title: string;
  subtitle?: string;
  excerpt: string;
}

interface BlogSearchProps {
  posts: SearchablePost[];
  children: ReactNode;
}

export default function BlogSearch({ posts, children }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const postCards = Children.toArray(children);

  const matchingCards = posts.flatMap((post, index) => {
    const searchableText = `${post.title} ${post.subtitle ?? ''} ${post.excerpt}`.toLowerCase();
    return !normalizedQuery || searchableText.includes(normalizedQuery)
      ? [postCards[index]]
      : [];
  });

  return (
    <>
      <div className="blog-search">
        <label htmlFor="blog-search" className="blog-search__label">
          Search teacher resources
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search teacher resources..."
          className="blog-search__input"
          aria-controls="blog-post-list"
        />
      </div>

      <div id="blog-post-list" className="blog-post-list">
        {matchingCards}
      </div>

      {matchingCards.length === 0 ? (
        <div className="blog-search__empty" role="status">
          <p>No teacher resources match your search.</p>
          <span>Try a different keyword.</span>
        </div>
      ) : null}
    </>
  );
}
