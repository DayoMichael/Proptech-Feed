/**
 * Renders a JSON-LD structured-data block. Server-rendered into the markup so
 * crawlers see it without executing JS.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
