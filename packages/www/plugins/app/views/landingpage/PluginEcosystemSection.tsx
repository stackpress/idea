export default function PluginEcosystemSection() {
  return (
    <section className="theme-bg-bg0 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 relative overflow-hidden">

      <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl font-bold">🔌 The Plugin Ecosystem</h3>
      <p className="mb-4 sm:mb-6 text-base sm:text-lg max-w-3xl">
        The true power of <span className="text-yellow-300 font-semibold">.idea</span> lies in its plugin system — a bridge from simple schema definitions to full‑stack applications.
      </p>
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-language text-amber-300" />
            <div className="font-semibold">Multi‑Language Support</div>
          </div>
          <ul className="text-sm sm:text-base opacity-90 space-y-1 pl-4 list-disc">
            <li>TypeScript/JavaScript: Interfaces, types, validation</li>
            <li>Python: Dataclasses, Pydantic, SQLAlchemy</li>
            <li>Rust: Structs, enums, serde</li>
            <li>Go: Structs, JSON tags, validation</li>
            <li>Java: POJOs, JPA, annotations</li>
            <li>C#: Classes, EF models</li>
            <li>PHP: Classes, Eloquent, validation</li>
            <li>…and more</li>
          </ul>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-layer-group text-violet-300" />
            <div className="font-semibold">Framework Integration</div>
          </div>
          <ul className="text-sm sm:text-base opacity-90 space-y-1 pl-4 list-disc">
            <li>React, Vue, Angular, Svelte</li>
            <li>Next.js, Express, FastAPI, Django</li>
            <li>Components, routes, models, middleware</li>
          </ul>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-database text-emerald-300" />
            <div className="font-semibold">Database Support</div>
          </div>
          <ul className="text-sm sm:text-base opacity-90 space-y-1 pl-4 list-disc">
            <li>SQL: Postgres, MySQL, SQLite, SQL Server</li>
            <li>NoSQL: MongoDB, DynamoDB, Firestore</li>
            <li>Graph: Neo4j, ArangoDB</li>
            <li>Time‑series: InfluxDB, TimescaleDB</li>
            <li>Search: Elasticsearch, Solr</li>
          </ul>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-book text-sky-300" />
            <div className="font-semibold">Documentation &amp; Tools</div>
          </div>
          <ul className="text-sm sm:text-base opacity-90 space-y-1 pl-4 list-disc">
            <li>OpenAPI/Swagger specs</li>
            <li>Schema diagrams &amp; table docs</li>
            <li>Form generators with validation</li>
            <li>Mock data &amp; fixtures</li>
            <li>Migration scripts</li>
            <li>Environment &amp; CI/CD configs</li>
          </ul>
        </div>
      </div>
    </section>
  )
}