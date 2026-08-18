// How many downloadables render on first paint — the rest load
// lazily (in the browser, as the visitor scrolls) instead of all at
// once. Kept in its own file (rather than page.tsx) so the client
// list component can import it without pulling in server-only code.
export const DOWNLOADABLES_PAGE_SIZE = 12;
