import "../styles/searchBar.css";

type Props = {
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
  placeholder?: string;
};

const CommonSearch = ({
  search,
  setSearch,
  placeholder = "Search...",
}: Props) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />
    </div>
  );
};

export default CommonSearch;