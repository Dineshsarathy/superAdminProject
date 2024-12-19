import Header from "../Component/Header";
import SideBar from "../Component/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";


const StylishTable = ({ data, columns , sortOption, onSortChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
  };

  return (
    <div className="table-container">
      <table className="stylish-table">
      <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.accessor}
                        onClick={() => {
                          if (column.accessor !== "actions") { // Prevent sorting on "actions"
                            onSortChange(column.accessor);
                          }
                        }}
                        style={{
                          cursor: column.accessor === "actions" ? "default" : "pointer",
                          position: "relative",
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center" }}>
                          {column.header}

                          {/* Sorting Arrows (conditionally render) */}
                          {column.accessor !== "actions" && sortOption.column === column.accessor ? (
                            <span style={{ marginLeft: "5px" }}>
                              {sortOption.direction === "asc" ? (
                                <span style={{ color: "black" }}>&#9650;</span> // Up arrow ▲
                              ) : (
                                <span style={{ color: "black" }}>&#9660;</span> // Down arrow ▼
                              )}
                            </span>
                          ) : column.accessor !== "actions" ? (
                            <span style={{ marginLeft: "5px", color: "#ccc" }}>
                              &#9650; &#9660; {/* Neutral arrows */}
                            </span>
                          ) : null} {/* Do not render arrows for 'actions' */}
                        </span>
                      </th>
                    ))}
                  </tr>
          </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.accessor}>
                  {column.accessor === "Client_status"
                    ? row[column.accessor]
                      ? "Active"
                      : "Inactive"
                    : column.accessor === "HostedDate" || column.accessor === "RenewalDate"
                    ? formatDate(row[column.accessor]) // Format date
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <Icon icon="material-symbols-light:fast-rewind" style={{ fontSize: "23px" }} />Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <Icon icon="material-symbols-light:fast-forward" style={{ fontSize: "23px" }} />
        
      </button>
    </div>
  );
};

export default function ClientsList() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]); // Sorted data
   const [sortOption, setSortOption] = useState("alphabetic", { column: 'Client_name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
const paginatedData = sortedData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  // Backend process
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/clientdetails");
        const fetchedData = response.data.map((item) => ({
          ...item,
          edit: true, // Placeholder for edit actions
        }));
        setData(fetchedData);
        setSortedData(fetchedData); // Initialize sortedData
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle sorting logic
  useEffect(() => {
    const sortData = () => {
      let sorted = [...data];
      if (sortOption === "alphabetic") {
        sorted.sort((a, b) => a.Client_name.localeCompare(b.Client_name));
      } else if (sortOption === "reverse-alphabetic") {
        sorted.sort((a, b) => b.Client_name.localeCompare(a.Client_name));
      } else if (sortOption === "date-newest") {
        sorted.sort((a, b) => new Date(b.HostedDate) - new Date(a.HostedDate));
      } else if (sortOption === "date-oldest") {
        sorted.sort((a, b) => new Date(a.HostedDate) - new Date(b.HostedDate));
      }
      setSortedData(sorted);
    };

    sortData();
  }, [sortOption, data]);
  // Sorting logic when sortOption changes
    useEffect(() => {
      const sortData = () => {
        const sorted = [...data];
        const { column, direction } = sortOption;
        sorted.sort((a, b) => {
          if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
          if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
          return 0;
        });
        setSortedData(sorted);
      };
      sortData();
    }, [sortOption, data]);
    
    const handleSortChange = (column) => {
      setSortOption((prev) => {
        // Toggle direction if the same column is clicked
        if (prev.column === column) {
          return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { column, direction: 'asc' }; // Default to ascending if a new column is clicked
      });
    };
  // Handle search functionality
  useEffect(() => {
    const filteredData = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSortedData(filteredData);
  }, [searchTerm, data]);

  // Sample columns and data for the StylishTable
  const columns = [
    { header: "Client_id", accessor: "Client_id" },
    { header: "Client Name", accessor: "Client_name" },
    { header: "Client Status", accessor: "Client_status" },
    { header: "Email-Id", accessor: "Client_emailid" },
    { header: "Hosted Date", accessor: "HostedDate" },
    { header: "Phone No", accessor: "Client_phone" },
    { header: "Renewal Date", accessor: "RenewalDate" },
    { header: "Domain", accessor: "Domain" },
  ];

  return (
    <>
      <SideBar isCollapsed={isCollapsed} />
      <div className={`clientlist ${isCollapsed ? "client-collapsed" : "clientlist"}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="client-list-contents">
          <h2 className="client-header">Client List</h2>
          <div className="table-props">
            <input
              className="search"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <div className="filter">
              <label>
                <Icon className="filter-icon" icon="stash:filter-light" style={{ fontSize: "28px" }} />
                <span>Sort By :</span>
              </label>
              <select
                id="filterDropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="alphabetic">Alphabetical Order (A-Z)</option>
                <option value="reverse-alphabetic">Alphabetical Order (Z-A)</option>
                <option value="date-newest">Modified Date (Newest First)</option>
                <option value="date-oldest">Modified Date (Oldest First)</option>
              </select>
            </div>
          </div>
          <StylishTable                  
                data={paginatedData} // Use paginatedData instead of sortedData
                 columns={columns}
                 sortOption={sortOption}
                  onSortChange={handleSortChange}/>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
