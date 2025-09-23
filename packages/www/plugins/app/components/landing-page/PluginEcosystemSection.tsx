import { Translate, useLanguage } from 'r22n';

export default function PluginEcosystemSection() {
  const { _ } = useLanguage();
  
  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {_('The Plugin Ecosystem')}
      </h2>
      
      <p className="text-lg mb-8 max-w-3xl mx-auto text-center">
        <Translate>
          The true power of <strong className='text-yellow-500'>.idea</strong> 
          lies in its plugin system — a bridge from simple schema 
          definitions to full‑stack applications.
        </Translate>
      </p>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">   
        <div className="theme-bg-bg1 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className='text-blue-400'>
              <i className="fa-solid fa-earth-asia"></i>
            </span>
            <h3 className="font-bold">
              {_('Multi‑Language Support')}
            </h3>
          </div>
          <ul className="text-base space-y-1 pl-4 list-disc">
            <li>
              <Translate>
                TypeScript/JavaScript: Interfaces, types, validation
              </Translate>
            </li>
            <li>
              <Translate>
                Python: Dataclasses, Pydantic, SQLAlchemy
              </Translate>
            </li>
            <li>
              <Translate>
                Rust: Structs, enums, serde
              </Translate>
            </li>
            <li>
              <Translate>
                Go: Structs, JSON tags, validation
              </Translate>
            </li>
            <li>
              <Translate>
                Java: POJOs, JPA, annotations
              </Translate>
            </li>
            <li>
              <Translate>
                C#: Classes, EF models
              </Translate>
            </li>
            <li>
              <Translate>
                PHP: Classes, Eloquent, validation
              </Translate>
            </li>
            <li>
              <Translate>
                …and more
              </Translate>
            </li>
          </ul>
        </div>
        
        <div className="theme-bg-bg1 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className='text-blue-400'>
              <i className="fa-brands fa-react"></i>
            </span>
            <h3 className="font-bold">
              {_('Framework Integration')}
            </h3>
          </div>
          <ul className="text-base space-y-1 pl-4 list-disc">
            <li>
              <Translate>
                React, Vue, Angular, Svelte
              </Translate>
            </li>
            <li>
              <Translate>
                Next.js, Express, FastAPI, Django
              </Translate>
            </li>
            <li>
              <Translate>
                Components, routes, models, middleware
              </Translate>
            </li>
          </ul>
        </div>
        
        <div className="theme-bg-bg1 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className='text-green-400'>
              <i className="fa-solid fa-database"></i>
            </span>
            <h3 className="font-bold">
              {_('Database Support')}
            </h3>
          </div>
          <ul className="text-base space-y-1 pl-4 list-disc">
            <li>
              <Translate>
                SQL: Postgres, MySQL, SQLite, SQL Server
              </Translate>
            </li>
            <li>
              <Translate>
                NoSQL: MongoDB, DynamoDB, Firestore
              </Translate>
            </li>
            <li>
              <Translate>
                Graph: Neo4j, ArangoDB
              </Translate>
            </li>
            <li>
              <Translate>
                Time‑series: InfluxDB, TimescaleDB
              </Translate>
            </li>
            <li>
              <Translate>
                Search: Elasticsearch, Solr
              </Translate>
            </li>
          </ul>
        </div>
        
        <div className="theme-bg-bg1 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className='text-purple-400'>
              <i className="fa-solid fa-book-open"></i>
            </span>
            <h3 className="font-bold">
              {_('Documentation & Tools')}
            </h3>
          </div>
          <ul className="text-base space-y-1 pl-4 list-disc">
            <li>
              <Translate>
                OpenAPI/Swagger specs
              </Translate>
            </li>
            <li>
              <Translate>
                Schema diagrams & table docs
              </Translate>
            </li>
            <li>
              <Translate>
                Form generators with validation
              </Translate>
            </li>
            <li>
              <Translate>
                Mock data & fixtures
              </Translate>
            </li>
            <li>
              <Translate>
                Migration scripts
              </Translate>
            </li>
            <li>
              <Translate>
                Environment & CI/CD configs
              </Translate>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}