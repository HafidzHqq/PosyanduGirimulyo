function PersonCard({ member, prominent = false }) {
  return (
    <div
      className={`min-h-full rounded-2xl border bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card sm:p-5 ${
        prominent ? "border-primary/30 bg-primaryLight/20" : "border-slate-200"
      }`}
    >
      {member.position && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {member.position}
        </p>
      )}
      <p className={`${prominent ? "text-xl" : "text-base"} leading-snug font-bold text-ink`}>{member.name}</p>
      {member.note && (
        <p className="mt-3 rounded-xl bg-secondaryLight/45 px-3 py-2 text-center text-xs font-medium leading-5 text-slate-700">
          {member.note}
        </p>
      )}
    </div>
  );
}

function OrganizationGroup({ group }) {
  if (group.layout === "leaders") {
    return (
      <section className="relative rounded-2xl border border-primary/20 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <i className="fa-solid fa-landmark" aria-hidden="true" />
          </span>
          <h3 className="text-center text-lg font-bold text-ink">{group.title}</h3>
        </div>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {group.members.map((member) => (
            <PersonCard key={`${group.title}-${member.position || member.name}`} member={member} prominent />
          ))}
        </div>
      </section>
    );
  }

  const isTerritory = group.layout === "territory";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primaryLight/45 text-primary ring-1 ring-primaryLight">
          <i className={`fa-solid ${isTerritory ? "fa-map-location-dot" : "fa-sitemap"}`} aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-ink sm:text-lg">{group.title}</h3>
      </div>

      <div className={`grid gap-3 ${isTerritory ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {group.members.map((member) => (
          <PersonCard key={`${group.title}-${member.position || member.name}`} member={member} />
        ))}
      </div>
    </section>
  );
}

function InfoSection({ section }) {
  const isBlue = section.tone === "blue";
  const iconClass = isBlue ? "bg-secondaryLight text-secondary ring-secondaryLight" : "bg-primaryLight/50 text-primary ring-primaryLight";

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</p>
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{section.title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {section.points.map((point) => (
          <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4" key={point.title}>
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${iconClass}`}>
              <i className={`fa-solid ${isBlue ? "fa-chart-line" : "fa-hands-holding-child"}`} aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-ink">{point.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{point.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrganizationRoot({ villageGovernment }) {
  return (
    <section className="mx-4 mb-5 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card sm:mx-7 sm:mb-7">
      <div className="bg-primary px-5 py-6 text-white sm:px-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primaryLight">Bagan Organisasi Desa</p>
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{villageGovernment.title}</h2>
        <p className="mt-2 text-sm font-medium text-white/90">{villageGovernment.subtitle}</p>
      </div>

      <div className="bg-muted/45 p-4 sm:p-6">
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-sm rounded-2xl border border-primary/20 bg-white p-5 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Akar Utama</p>
            <h3 className="mt-1 text-xl font-bold text-ink">{villageGovernment.root?.title || "Desa Girimulyo"}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{villageGovernment.root?.description}</p>
          </div>

          <div className="mx-auto h-10 w-px bg-primary/30" />
          <div className="hidden h-px rounded-full bg-primary/25 md:block" />

          <div className="grid gap-6">
            {villageGovernment.groups.map((group, index) => (
              <div className="relative pt-6" key={group.title}>
                <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-primary/25" />
                {index > 0 && <div className="absolute left-0 right-0 top-0 hidden h-px bg-primary/15 md:block" />}
                <OrganizationGroup group={group} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function InfoPage({ page, headingLevel = "h2" }) {
  const Heading = headingLevel;
  const villageGovernment = page.villageGovernment;

  return (
    <main className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft sm:mt-7">
      <section className="border-b border-slate-200 bg-muted/70 px-4 py-6 sm:px-7 sm:py-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Posyandu Girimulyo</p>
        <Heading className="max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-4xl">
          {page.title}
        </Heading>
      </section>

      <section className="px-4 py-5 sm:px-7 sm:py-7">
        <div className="max-w-4xl">
          {page.paragraphs.map((paragraph) => (
            <p className="my-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {page.highlights?.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {page.highlights.map((highlight) => (
              <div className="rounded-2xl border border-slate-200 bg-muted/75 p-4 shadow-sm" key={highlight.value}>
                <p className="text-2xl font-bold text-primary">{highlight.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{highlight.label}</p>
              </div>
            ))}
          </div>
        )}

        {page.points?.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {page.points.map((point) => (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={point.title}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-accent ring-1 ring-muted">
                  <i className="fa-solid fa-circle-info" aria-hidden="true" />
                </div>
                <h4 className="mb-2 text-base font-semibold text-ink sm:text-lg">{point.title}</h4>
                <p className="m-0 text-sm leading-7 text-slate-600 sm:text-[0.95rem]">{point.description}</p>
              </div>
            ))}
          </div>
        )}

        {page.sections?.map((section) => (
          <InfoSection key={section.title} section={section} />
        ))}
      </section>

      {villageGovernment && <OrganizationRoot villageGovernment={villageGovernment} />}
    </main>
  );
}
