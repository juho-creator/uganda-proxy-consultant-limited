import { Container } from "@/components/container";

/** Skeleton shown while a single article loads, mirroring its hero and body layout. */
export default function ArticleLoading() {
  return (
    <div aria-busy="true" aria-label="Loading article">
      <section className="bg-ink-950 pb-16 pt-32 lg:pb-20 lg:pt-40">
        <Container>
          <div className="h-3 w-24 animate-pulse bg-ink-800" />
          <div className="mt-6 h-12 w-full max-w-2xl animate-pulse bg-ink-800" />
          <div className="mt-3 h-12 w-2/3 max-w-xl animate-pulse bg-ink-800" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="image-shimmer h-4 w-24" />
            <div className="image-shimmer mt-8 h-5 w-full" />
            <div className="image-shimmer mt-3 h-5 w-3/4" />
            <div className="image-shimmer mt-10 aspect-[16/9]" />
            <div className="mt-10 space-y-3">
              <div className="image-shimmer h-4 w-full" />
              <div className="image-shimmer h-4 w-full" />
              <div className="image-shimmer h-4 w-5/6" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
