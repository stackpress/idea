//modules
import { useState, useEffect } from "react"
import Fuse from "fuse.js"
import clsx from "clsx";

//search types
type SearchItem = {
  title: string;
  url: string;
  description: string;
};

//styles
const searchFieldStyle = clsx(
  "border",
  "border-gray-500",
  "lg:w-120",
  "mx-10",
  "p-2",
  "placeholder:text-gray-600",
  "theme-bg-bg1",
  "z-10"
);

const searchResultsStyle = clsx(
  "absolute",
  "border",
  "border-gray-500",
  "lg:w-120",
  "mb-2",
  "md:w-96",
  "mt-3",
  "right-10",
  "sm:w-100",
  "top-full",
  "w-85",
  "z-200"
);

const noResultsStyle = clsx(
  "absolute",
  "border",
  "border-gray-500",
  "lg:w-120",
  "mb-2",
  "md:w-96",
  "mt-3",
  "right-10",
  "sm:w-100",
  "top-full",
  "w-85",
  "z-200"
);


export default function Search() {
  //hooks
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem>>();

  //load search index function
  async function loadIndex() {
    //fetch search index file from public directory
    const result = await fetch("/search-list.json");
    //await response and parse json
    const data: SearchItem[] = await result.json();

    //create fuse instance with options
    const fuseInstance = new Fuse(data, {
      keys: ["title", "description"],
      threshold: 0.6,
      findAllMatches: false,
      minMatchCharLength: 2
    });

    //set fuse instance to state
    setFuse(fuseInstance);
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
          className={searchFieldStyle}
        />
        {results.length > 0 ? (
          //results found
          <div className={searchResultsStyle}>
            <ul className="overflow-y-auto py-2 space-y-2 theme-bg-bg1">
              {results.slice(0, 3).map((item, index) => (
                <a href={item.url}>
                  <li
                    key={index}
                    className="hover:theme-bg-bg2 p-4"
                  >
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-500 text-sm truncate">
                      {item.description}
                    </p>
                  </li>
                </a>
              ))}
            </ul>
          </div>
        ) : query ? (
          //if no results found
          <div className={noResultsStyle}>
            <ul className="overflow-y-auto py-2 space-y-2 theme-bg-bg1">
              <li className="p-4 text-center text-gray-500">
                No results found.
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </>
  )
}