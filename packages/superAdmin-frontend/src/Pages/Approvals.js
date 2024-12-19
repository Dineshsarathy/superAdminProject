import Header from "../Component/Header";
import SideBar from "../Component/SideBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import {URL} from "url";

const StylishTable = ({ data, columns, handleEdit, handleUnzip, handleDelete, handlePreview , sortOption, onSortChange }) => {

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
              {columns.map((column) =>  column.accessor === "actions" ? 
              (
                <td key="approval00">
                  <div className="approval-buttons">
                    <button
                      variant="contained"
                      color="primary"
                      className="btn-approve"
                      style={{backgroundColor:"rgb(9, 134, 9)"}}
                      onClick={() => {
                        handleEdit(row); // Approve action
                        handleUnzip(row); 
                      }}
                      //disabled={row.Approval_status === "Approved"}

                    >
                     <Icon icon="simple-line-icons:check" style={{ fontSize: '14px',margin:0 }}/> Approve
                     </button>
                    <button
                      variant="contained"
                      color="secondary"
                      className="cancel-btn"
                      style={{backgroundColor:"red"}}
                      onClick={() => handleDelete(row)}
                    >
                     <Icon  icon="ic:outline-cancel" style={{ fontSize: '14px',   }}/>
                    </button>                     
                    <button
                      variant="contained"
                      color="secondary"
                      className="preview-btn"
                      style={{backgroundColor:"blue"}}
                      onClick={() => handlePreview(row)}
                    >
                     <Icon  icon="fluent-mdl2:view" style={{ fontSize: '14px',   }}/>
                    </button>
                  </div>
                </td>
              ) : 
              (
                <td key={column.accessor}>{column.accessor === "Status"
                  ? row[column.accessor]
                    ? "Active"
                    : "Inactive"
                    : column.accessor === "CompletedDate" || column.accessor === "ApprovedDate"
                  ? formatDate(row[column.accessor]) // Format date
                  : row[column.accessor]}</td>
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

export default function Templatelist() {
  const [data, setData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortedData, setSortedData] = useState([]); // Sorted data
 const [sortOption, setSortOption] = useState("alphabetic", { column: 'Temp_name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Pagination logic
const totalPages = Math.ceil(sortedData.length / itemsPerPage);
const paginatedData = sortedData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  // Handle search functionality
  useEffect(() => {
    const filteredData = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSortedData(filteredData);
  }, [searchTerm, data]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };


  // handle approve
  const handleEdit = async (row) => {
    try {
      const updatedRow = { ...row, Approval_status: "Approved" }; // Update status to "Approved"
      const response = await axios.put(`http://localhost:8000/api/templist/${row._id}`, updatedRow);

      if (response.status === 200) {
        // Update the local state to reflect the changes
        setData((prevData) =>
          prevData.map((item) =>
            item._id === row._id ? { ...item, Approval_status: "Approved" } : item
          )
        );
        console.log("Approval status updated successfully");
      } else {
        console.error("Failed to update approval status:", response.data);
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  // handle unzip
  const handleUnzip = async (row) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/templist/unzip/${row._id}`);

      if (response.status === 200) {
        // Update the local state to reflect the changes
        setData((prevData) =>
          prevData.map((item) =>
            item._id === row._id ? { ...item, Approval_status: "Approved" } : item
          )
        );
        toast.success("selected template successfully Unzipped");
      } else {
        console.error("Failed Unzip selected file:", response.data);
      }
    } catch (error) {
      const errorcatcher = await axios.get(`http://localhost:8000/api/templist/unzip/${row._id}`);
      toast.error(`Error Occures while Extracting ${errorcatcher.Temp_name}:`, error);
    }
  };

  //Handle Delete
  const handleDelete = async (row) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the template "${row.Temp_name}"?`);
    
    if (confirmDelete) {
      try {
        // Send a DELETE request to the API
        const response = await axios.delete(`http://localhost:8000/api/templist/${row._id}`);
        
        if (response.status === 200) {
          toast.success(`Template "${row.Temp_name}" deleted successfully!`);
          
          // Update state to remove the deleted item
          setData((prevData) => prevData.filter((item) => item._id !== row._id));
        } else {
          console.error("Failed to delete the template:", response.data);
          toast.error("Failed to delete the template. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error("An error occurred while deleting the template. Please try again later.");
      }
    } else {
      console.log("Delete action canceled for:", row);
    }
  };

 //Handle Preview
 const handlePreview = async (row) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/templist/${row._id}`);
    // Access `templateUrl` from `response.data`
    if (response.data && response.data.templateUrl) {
        // Construct the file URL, assuming filePath starts from "/Preview_Templates"
        const fileUrl = `http://localhost:${response.data.usePort}${response.data.templateUrl}`;
        // Open the file URL in a new tab
        window.open(fileUrl, '_blank');
    } else {
      toast.error("Template URL not available for this item.");
    }
  } catch (error) {
    console.error("Error in Preview function", error);
    toast.error("An error occurred while trying to fetch the template URL.");
  }
};
const handleSortChange = (column) => {
  setSortOption((prev) => {
    // Toggle direction if the same column is clicked
    if (prev.column === column) {
      return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
    }
    return { column, direction: 'asc' }; // Default to ascending if a new column is clicked
  });
};

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
  }, [sortOption, data]);  // This will re-run when either `sortOption` or `data` changes.
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/templist");
        const fetchedData = response.data.map((item) => ({
          ...item,
          edit: true, // Placeholder for edit actions
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const sortData = () => {
      let sorted = [...data];
      if (sortOption === "alphabetic") {
        sorted.sort((a, b) => (a.Temp_name || "").localeCompare(b.Temp_name || ""));
      } else if (sortOption === "reverse-alphabetic") {
        sorted.sort((a, b) => (b.Temp_name || "").localeCompare(a.Temp_name || ""));
      } else if (sortOption === "date-newest") {
        sorted.sort((a, b) => new Date(b.CompletedDate || 0) - new Date(a.CompletedDate || 0));
      } else if (sortOption === "date-oldest") {
        sorted.sort((a, b) => new Date(a.CompletedDate || 0) - new Date(b.CompletedDate || 0));
      }
      setSortedData(sorted);
    };
    sortData();
  }, [sortOption, data]);

  const columns = [
    { header: "Template Name", accessor: "Temp_name" },
    { header: "Template Id", accessor: "Temp_id" },
    { header: "Template category", accessor: "Temp_category" },
    { header: "Approval Status", accessor: "Approval_status" },
    { header: "Completed Date", accessor: "CompletedDate" },
    { header: "Approved Date", accessor: "ApprovedDate" },
    { header: "Actions", accessor: "actions" },
    { header: "Template Url", accessor: "templateUrl" },
    { header: "Port No.", accessor: "usePort" },
  ];

  return (
    <>
      <SideBar isCollapsed={isCollapsed} />
      <div className={`approvallist ${isCollapsed ? 'approval-collapsed' : 'approvallist'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <ToastContainer />
        <div className="approval-list-contents">
          <h2 className="approval-header">Approval List</h2>
          <div className="table-props">
            <input
              className="search"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <div className="filter">
              <label><Icon className="filter-icon" icon="stash:filter-light" style={{ fontSize: '28px' }}/><span>Sort By :</span></label>
              <select
                id="filterDropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="alphabetic">Alphabetical Order (A-Z)</option>
                <option value="reverse-alphabetic">Alphabetical Order (Z-A)</option>
                <option value="date-newest">Completed Date (Newest First)</option>
                <option value="date-oldest">Completed Date (Oldest First)</option>
              </select>
            </div>
          </div>
          <StylishTable
                  data={paginatedData}  // Use the paginated data after sorting
                  columns={columns}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleUnzip={handleUnzip}
                  handlePreview={handlePreview}
                  sortOption={sortOption}
                  onSortChange={handleSortChange}  // Pass sorting handler to the table
              />
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
