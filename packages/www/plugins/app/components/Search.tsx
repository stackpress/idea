import { useState, useEffect } from "react"
import Fuse from "fuse.js"

type SearchItem = {
  title: string;
  url: string;
  description: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem>>();

  async function loadIndex() {
    const result = await fetch("/search-list.json")
    const data: SearchItem[] = await result.json()

    const fuseInstance = new Fuse(data, {
      keys: ["title", "description"],
      threshold: 0.6,
      findAllMatches: false,
      minMatchCharLength: 2
    })

    setFuse(fuseInstance)
  }

  useEffect(() => {
    loadIndex()

    if (!fuse || !query) {
      setResults([])
      return
    }

    const searchResults = fuse.search(query).map(result => result.item)
    setResults(searchResults)
  }, [query, fuse])

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 z-10 mx-10 placeholder:text-gray-600 
        theme-bg-bg1 border border-gray-500 lg:w-120"
      />
      {results.length > 0 ? (
        <div className="absolute top-full mt-3 right-10 z-200 
        mb-2 border border-gray-500 w-85 sm:w-100 md:w-96 lg:w-120">
          <ul className="space-y-2 theme-bg-bg1 py-2 overflow-y-auto">
            {results.slice(0, 3).map((item, index) => (
              <a href={item.url}>
                <li
                  key={index}
                  className="p-4 hover:theme-bg-bg2"
                >

                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {item.description}
                  </p>

                </li>
              </a>
            ))}
          </ul>
        </div>
      ) : query ? (
        <div className="absolute top-full mt-3 right-10 z-200 
        mb-2 border border-gray-500 w-85 sm:w-100 md:w-96 lg:w-120">
          <ul className="space-y-2 theme-bg-bg1 py-2 overflow-y-auto">
            <li className="p-4 text-gray-500 text-center">
              No results found.
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}