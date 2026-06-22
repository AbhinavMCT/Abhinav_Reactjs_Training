import { useEffect, useState } from "react";
import "../styles/searchBar.css";

type Props = {
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
  placeholder?: string;
  delay?: number;
};

const CommonSearch = ({
  search,
  setSearch,
  placeholder = "Search...",
  delay = 500,
}: Props) => {
  const [inputValue, setInputValue] =
    useState(search);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, delay);

    return () =>
      clearTimeout(timer);
  }, [inputValue, setSearch, delay]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) =>
          setInputValue(e.target.value)
        }
      />
    </div>
  );
};

export default CommonSearch;