import Header from "../Component/Header";
import SideBar from "../Component/SideBar";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


//Edit function

const StylishTable = ({ data, columns, handleEdit, handleDelete, handlePreview , sortOption, onSortChange}) => {
  

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
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No data found</td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) =>
                  column.accessor === "actions" ? (
                    <td key="actions">
                      <div className="action-buttons">
                        <button
                          style={{ backgroundColor: "rgb(9, 134, 9)" }}
                          onClick={() => handleEdit(row)}
                        >
                          <Icon
                            icon="fa6-solid:file-pen"
                            style={{ fontSize: "14px", margin: 0 }}
                          />
                        </button>
                        <button
                          style={{ backgroundColor: "red" }}
                          onClick={() => handleDelete(row)}
                        >
                          <Icon
                            icon="streamline:recycle-bin-2"
                            style={{ fontSize: "14px" }}
                          />
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
                  ) : (
                    <td key={column.accessor}>
                      {column.accessor === "Employee_status"
                        ? row[column.accessor]
                          ? "Active"
                          : "Inactive"
                        : column.accessor === "HostedDate" ||
                          column.accessor === "RenewalDate"
                        ? formatDate(row[column.accessor])
                        : row[column.accessor]}
                    </td>
                  )
                )}
              </tr>
            ))
          )}
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

export default function EmployeeList() {
  const [data, setData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  //Eidt function
  const [editingEmployee, setEditingEmployee] = useState(null); // Track the employee being edited
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  //sorting code
  const [sortedData, setSortedData] = useState([]); // Sorted data
  const [sortOption, setSortOption] = useState("alphabetic", { column: 'Employee_name', direction: 'asc' });
  //search filter
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

  const fetchData = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        const endpoint = query
          ? `http://localhost:8000/api/employees/search?query=${query}`
          : `http://localhost:8000/api/employees`;

        const response = await axios.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    },
    [setData]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(searchTerm);
    }, 500); // Debounce API calls

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchData]);


//Edit action function
  const handleEdit = (row) => {
    setEditingEmployee(row); // Set the selected employee
    setIsEditPopupOpen(true); // Open the edit popup
    console.log("Edit action triggered for:", row);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { _id, Employee_name, Email_id, Phone_number, Employee_status } = editingEmployee;
      await axios.put(`http://localhost:8000/api/employees/${_id}`, {
        Employee_name,
        Email_id,
        Phone_number,
        Employee_status
      });

      toast.success("Employee details updated successfully!");
      setIsEditPopupOpen(false);
      fetchData(); // Refresh the table data
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee details.");
    }
  };

//delete function
  const handleDelete = async(row) => {
    if (window.confirm(`Are you sure you want to delete employee ${row.Employee_name}?`)) {
      try {
        // Assuming the backend route is: DELETE /api/employees/:id
        await axios.delete(`http://localhost:8000/api/employees/${row._id}`);
        toast.success(`Employee ${row.Employee_name} deleted successfully!`);
  
        // Update the state to reflect the deleted employee
        setData((prevData) => prevData.filter((employee) => employee.Employee_id !== row.Employee_id));
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete the employee. Please try again.");
      }
    }

    console.log("Delete action triggered for:", row);
  };

  const handlePreview = async (row) => {
    try {
      if (!row || !row._id) {
        console.error("Invalid row data:", row);
        toast.error("Invalid employee ID.");
        return;
      }
  
      console.log("Row Data:", row);
      console.log("Fetching data for Employee ID:", row._id);
  
      const response = await axios.get(`http://localhost:8000/api/employees/${row._id}`);
      console.log("API Response:", response.data);
  
      const { usePort, employeeUrl } = response.data;
  
      if (usePort && employeeUrl) {
        const fileUrl = `http://localhost:${usePort}${employeeUrl}`;
        console.log("Opening File URL:", fileUrl);
        window.open(fileUrl, '_blank');
      } else {
        console.error("Missing usePort or employeeUrl in response:", response.data);
        toast.error("Employee URL or port is not available.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        console.error("Server Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      } else {
        console.error("Request Setup Error:", error.message);
      }
      toast.error("An error occurred while trying to fetch the employee URL.");
    }
  };
  


  // Handle sorting logic
  useEffect(() => {
    const sortData = () => {
      let sorted = [...data];
      if (sortOption === "alphabetic") {
        sorted.sort((a, b) => a.Employee_name.localeCompare(b.Employee_name));
      } else if (sortOption === "reverse-alphabetic") {
        sorted.sort((a, b) => b.Employee_name.localeCompare(a.Employee_name));
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

  // Sort column handler
  const handleSortChange = (column) => {
    setSortOption((prev) => {
      // Toggle direction if the same column is clicked
      if (prev.column === column) {
        return { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column, direction: 'asc' }; // Default to ascending if a new column is clicked
    });
  };


  const columns = [
    { header: "Employee-Id", accessor: "Employee_id" },
    { header: "Employee Name", accessor: "Employee_name" },
    { header: "Phone No.", accessor: "Phone_number" },
    { header: "Email-Id", accessor: "Email_id" },
    { header: "Employee Status", accessor: "Employee_status" },
    { header: "Actions", accessor: "actions" },
  ];

  return (
    <>
      <SideBar isCollapsed={isCollapsed} />
      <div className={`Emplist ${isCollapsed ? "emp-collapsed" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <ToastContainer />
        <div className="emp-list-contents">
          <h2 className="Emp-header">Employee List</h2>
          <div className="page-list">
            <div className="table-props">
              <input
                className="search"
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              />
              <div className="filter">
                        <label><Icon className="filter-icon" icon="stash:filter-light" style={{ fontSize: '28px', }}/><span>Sort By :</span></label>
                        <select id="filterDropdown"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}>
                          <option value="alphabetic">Alphabetical Order (A-Z)</option>
                          <option value="reverse-alphabetic">Alphabetical Order (Z-A)</option>
                        </select>
                    </div>
                    <Popup trigger={
                              <button className="button-add">
                                <Icon icon="carbon:add-alt" style={{ fontSize: "23px" }} />
                                <span>Add New</span>
                              </button>
                            }
                            modal
                            contentStyle={{
                              top: '15%',
                              width: '40%',
                              height: '450px',
                              margin: '0 auto',
                              padding: '20px',
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              textAlign: 'left',
                            }}
                          >
                  {(close) => (
                    <div>
                      <h3>Add New Employee</h3>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          // Generate a random password in the format 'as3737'
                          const generatePassword = () => {
                            const letters = "abcdefghijklmnopqrstuvwxyz";
                            const letterPart = letters[Math.floor(Math.random() * letters.length)] + 
                                              letters[Math.floor(Math.random() * letters.length)];
                            const numberPart = Math.floor(1000 + Math.random() * 9000).toString();
                            return letterPart + numberPart;
                          };

                          const employeeId = `E${Math.floor(10000 + Math.random() * 90000)}`;
                          const password = generatePassword(); // Call the password generator
                          const newEmployee = {
                            Employee_id: employeeId,
                            Employee_name: e.target.name.value,
                            Email_id: e.target.email.value,
                            Phone_number: e.target.phone.value,
                            Password: password, // Add password to the employee object
                            Employee_status: true,
                          };

                          try {
                            await axios.post('http://localhost:8000/api/employees', newEmployee);
                            toast.success('Employee added successfully with password: ' + password);
                            close(); // Close the popup
                          } catch (error) {
                            console.error('Error saving employee:', error);
                            toast.error('Failed to add employee.');
                          }
                          window.location.reload();
                        }}
                      >
                        <div style={{ marginBottom: '15px' }}>
                          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
                            Employee Name:
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                            Employee Email:
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>
                            Employee Phone Number:
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <button
                            type="submit"
                            style={{
                              backgroundColor: '#28a745',
                              color: '#fff',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '80px',
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={close}
                            style={{
                              backgroundColor: '#dc3545',
                              color: '#fff',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '80px',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </Popup>
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : (<>
              <StylishTable
                  data={paginatedData}  // Use the paginated data after sorting
                  columns={columns}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handlePreview={handlePreview}
                  sortOption={sortOption}
                  onSortChange={handleSortChange}  // Pass sorting handler to the table
              />
              <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {isEditPopupOpen && (
        <Popup open={isEditPopupOpen} onClose={() => setIsEditPopupOpen(false)} modal
        contentStyle={{
          top: '15%',
          width: '40%',
          height: '450px',
          margin: '0 auto',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          textAlign: 'left',
        }}>
          <div>
            <h3>Edit Employee Details</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "15px" }}>
                <label>Employee Name:</label>
                <input
                  type="text"
                  value={editingEmployee.Employee_name}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, Employee_name: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={editingEmployee.Email_id}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, Email_id: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={editingEmployee.Phone_number}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, Phone_number: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                    <label>Employee Status:</label>
                    <select
                      value={editingEmployee.Employee_status ? "true" : "false"}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          Employee_status: e.target.value === "true",
                        })
                      }
                      required
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{
                              backgroundColor: '#28a745',
                              color: '#fff',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '80px',
                            }}>Save</button>
                <button type="button" onClick={() => setIsEditPopupOpen(false)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '80px',
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Popup>
      )}
    </>
  );
}
