'use client';

export default function MinimalNavigation() {
  return (
    <nav className="min-nav" aria-label="Primary">
      <a href="#world" aria-label="Bea Sophia, return to the beginning">Bea Sophia</a>
      <div className="min-nav-right">
        <a href="#world">Work</a>
        <span aria-hidden="true">/</span>
        <a href="#world">About</a>
      </div>
    </nav>
  );
}
