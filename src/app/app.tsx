import { useDebounce } from "@uidotdev/usehooks";
import getSuggestions from "hooks/useGetSuggestions";
import React from "react";
import { Result } from "src/types/Result";

function App() {
  const [searchString, setSearchString] = React.useState<string | undefined>(
    ""
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<Result[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [selectedCountry, setSelectedCountry] = React.useState<Result>();
  const [error, setError] = React.useState<string | undefined>();

  const debounce = useDebounce(searchString, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
    setSearchString(data[index]?.name.common);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchString(data[selectedIndex]?.name.common);
    }

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => prev + 1);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => prev - 1);
    }
  };
  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const suggestions = await getSuggestions(debounce);
        if (isMounted) {
          setData(suggestions);
          setIsLoading(false);
          setError(undefined);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setData([]);
        setError("Failed to fetch suggestions");
      }
    };

    if (debounce) {
      fetchData();
    } else {
      setData([]);
    }

    return () => {
      isMounted = false;
    };
  }, [debounce]);

  return (
    <section>
      <header>
        <div style={{ margin: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <label htmlFor="common">Search</label>
            <div>
              <input
                type="text"
                id=""
                name="common"
                placeholder="Placeholder"
                value={searchString}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{
                  padding: "1px",
                  outline: "none",
                  minWidth: "min-content",
                }}
              />
              <button
                style={{ margin: "2px" }}
                onClick={() => {
                  setSearchString("");
                  setSelectedCountry(undefined);
                }}
              >
                Clear
              </button>
            </div>
          </div>
          {!error ? null : (
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <label htmlFor="common">Search</label>
            </div>
          )}
          <ul
            style={{
              width: "300px",
              scrollBehavior: "smooth",
              position: "absolute",
              maxHeight: "260px",
              overflowX: "hidden",
              overflowY: "auto",
              backgroundColor: "lightgray",
            }}
          >
            {isLoading && <li>Loading...</li>}
            {!data.length
              ? null
              : data.map((_, index) => (
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "40px",
                      padding: "1px",
                      backgroundColor:
                        selectedIndex === index ? "slategray" : "transparent",
                    }}
                    key={index}
                    onClick={() => {
                      handleListItemClick(index);
                      setSelectedCountry(data[index]);
                      setSearchString("");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>{data[index]?.name.common}</div>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </header>
      {selectedCountry && (
        <div style={{ margin: 20 }}>
          <h2>Selected Country:</h2>
          <p>Name: {selectedCountry.name.common}</p>
          <p>Official Name: {selectedCountry.name.official}</p>
          <p>Capital: {selectedCountry.capital[0]}</p>
          <p>Population: {selectedCountry.population}</p>
        </div>
      )}
    </section>
  );
}

export default App;
