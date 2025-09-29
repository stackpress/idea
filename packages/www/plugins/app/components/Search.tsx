//modules
import { useState, useEffect } from "react"
import Fuse from "fuse.js"

//search types
type SearchItem = {
  title: string;
  url: string;
  description: string;
};

export default function Search() {
  //hooks
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem>>();

  //load search index function
  async function loadIndex() {
    //fetch search index file from public directory
    const result = await fetch("/search-list.json")
    //await response and parse json
    const data: SearchItem[] = await result.json()

    //create fuse instance with options
    const fuseInstance = new Fuse(data, {
      keys: ["title", "description"],
      threshold: 0.6,
      findAllMatches: false,
      minMatchCharLength: 2
    })

    //set fuse instance to state
    setFuse(fuseInstance)
  }

  //effect to load index and perform search
  useEffect(() => {
    //initial load
    loadIndex()

    //check if fuse is ready and query is not empty
    if (!fuse || !query) {
      setResults([])
      return
    }

    //perform search
    const searchResults = fuse.search(query).map(result => result.item)
    setResults(searchResults)
  }, [query, fuse])

  return (
    <>
      {/* Search Field Component  */}
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
    </>
  )
}