/**
 * Renders a JSON-LD block. Structured data has to be in the server-rendered
 * HTML — crawlers that skip JavaScript (most AI crawlers do) never see markup a
 * client component injects later.
 */
export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
