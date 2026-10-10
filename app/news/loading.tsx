import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";

/** Skeleton cards shown while the article list loads. */
export default function NewsLoading() {
  return (
    <>
      <PageHero title="News & Insights" />

      <section className="py-20 sm:py-28" aria-busy="true" aria-label="Loading articles">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col border border-ink-100 bg-white">
                <div className="image-shimmer aspect-[16/10]" />
                <div className="flex flex-col gap-3 p-6">
                  <div className="image-shimmer h-3 w-20" />
                  <div className="image-shimmer h-5 w-4/5" />
                  <div className="image-shimmer h-3 w-full" />
                  <div className="image-shimmer h-3 w-2/3" />
                  <div className="image-shimmer mt-2 h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
