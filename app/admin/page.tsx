import Link from "next/link";
import type { Metadata } from "next";
import { MoveButtons } from "@/components/admin/admin-controls";
import { AdminShell } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/form-ui";
import { formatArticleDate } from "@/lib/article-date";
import { getArticles } from "@/lib/news";
import { requireAdmin } from "@/lib/require-admin";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = { title: "Dashboard" };

const primaryButton =
  "inline-flex items-center gap-1.5 rounded-sm bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-800";
const editLink =
  "rounded-sm border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-950 transition-colors hover:bg-ink-50";

function SectionHeader({ title, count, href, action }: { title: string; count: number; href: string; action: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-display text-xl font-semibold text-ink-950">
        {title} <span className="text-ink-400">({count})</span>
      </h2>
      <Link href={href} className={primaryButton}>
        <span aria-hidden="true">+</span> {action}
      </Link>
    </div>
  );
}

function Thumb({ src, className }: { src?: string; className: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- small admin preview of our own uploaded image
    <img src={src} alt="" className={`${className} shrink-0 border border-ink-100 object-cover`} />
  ) : (
    <div className={`${className} shrink-0 border border-ink-100 bg-ink-50`} />
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [articles, team] = await Promise.all([getArticles(), getTeam()]);

  return (
    <AdminShell title="Dashboard">
      <div className="space-y-14">
        <section>
          <SectionHeader title="News articles" count={articles.length} href="/admin/news/new" action="New article" />
          <ul className="mt-5 divide-y divide-ink-100 border border-ink-100 bg-white">
            {articles.length === 0 && <li className="px-5 py-8 text-center text-sm text-ink-500">No articles yet.</li>}
            {articles.map((article) => (
              <li key={article.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <Thumb src={article.thumbnail} className="h-12 w-[4.8rem]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-950">{article.title}</p>
                  <p className="text-xs text-ink-500">{formatArticleDate(article.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/news/${encodeURIComponent(article.id)}`} className="text-xs font-semibold text-ink-500 hover:text-clay-600">
                    View
                  </Link>
                  <Link href={`/admin/news/${encodeURIComponent(article.id)}`} className={editLink}>
                    Edit
                  </Link>
                  <DeleteButton
                    endpoint={`/api/admin/news/${encodeURIComponent(article.id)}`}
                    confirmMessage={`Delete "${article.title}" and its images? This cannot be undone.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeader title="Team members" count={team.length} href="/admin/team/new" action="Add member" />
          <ul className="mt-5 divide-y divide-ink-100 border border-ink-100 bg-white">
            {team.length === 0 && <li className="px-5 py-8 text-center text-sm text-ink-500">No team members yet.</li>}
            {team.map((member, index) => (
              <li key={member.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <Thumb src={member.photo} className="h-14 w-11" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-950">{member.name}</p>
                  <p className="text-xs text-ink-500">{member.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    endpoint={`/api/admin/team/${encodeURIComponent(member.id)}`}
                    canUp={index > 0}
                    canDown={index < team.length - 1}
                  />
                  <Link href={`/admin/team/${encodeURIComponent(member.id)}`} className={editLink}>
                    Edit
                  </Link>
                  <DeleteButton
                    endpoint={`/api/admin/team/${encodeURIComponent(member.id)}`}
                    confirmMessage={`Remove ${member.name} from the team page? This cannot be undone.`}
                    label="Remove"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
