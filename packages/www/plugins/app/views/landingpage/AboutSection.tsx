export default function AboutSection() {
  return (
    <section className=" bg-dark mx-auto max-w-4xl px-4 sm:px-8  sm:py-20 rounded-xl shadow-lg border border-gray-200/10">
      <div className="mb-8">
        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-center text-gray-100">
          <span className="text-yellow-300">.idea</span>
        </h1>
        <div className="mx-auto my-5 w-16 sm:w-20 border-t border-yellow-300/40 opacity-60"></div>
        <p className="text-base sm:text-lg text-center text-gray-400 max-w-xl mx-auto">
          The <span className="font-semibold text-yellow-300">.idea</span> file format is a declarative schema definition language designed to simplify application development by providing a single source of truth for data structures, relationships, and code generation.
        </p>
      </div>
    </section>
  )
}