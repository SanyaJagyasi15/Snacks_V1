import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Api from "../services/Api";
import "../css/ViewReceipt.css";

const ViewReceipt = () => {
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  };

  const [receipts, setReceipts] = useState([]);
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());
  const [orderedByFilter, setOrderedByFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptsPerPage] = useState(8);
  const navigate = useNavigate();
  const currentUser = Api.getCurrentUser();

  const [showFilters, setShowFilters] = useState(false);

  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await Api.getAllReceipts();
      setReceipts(response.data);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedReceipts((prev) =>
      prev.includes(id)
        ? prev.filter((receiptId) => receiptId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = () => {
    if (selectedReceipts.length === 1) {
      navigate(`/editreceipt/${selectedReceipts[0]}`);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(selectedReceipts.map((id) => Api.deleteReceipt(id)));
      fetchReceipts();
      setSelectedReceipts([]);
    } catch (error) {
      console.error("Failed to delete receipts:", error);
    }
  };

  const applyFilters = (receipts) => {
    const filteredReceipts = receipts.filter((receipt) => {
      const monthMatch = monthFilter
        ? receipt.date.startsWith(monthFilter)
        : true;
      const orderedByMatch = orderedByFilter
        ? receipt.orderedBy === orderedByFilter
        : true;
      const reasonMatch = reasonFilter
        ? reasonFilter === "other"
          ? !["snacks", "prasad"].includes(receipt.reason)
          : receipt.reason === reasonFilter
        : true;
      return monthMatch && orderedByMatch && reasonMatch;
    });
    return sortReceipts(filteredReceipts);
  };

  const handleAdd = () => {
    navigate("/addreceipt", { state: { orderedBy: currentUser } });
  };

  const calculateTotalExpense = (receipts) => {
    return receipts
      .reduce((total, receipt) => total + parseFloat(receipt.amount), 0)
      .toFixed(2);
  };

  const sortReceipts = (receipts) => {
    return [...receipts].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  return (
    <div className="view-receipt-container">
      <div className="view-receipt-content">
        <div className="view-receipt-header">
          <h2 className="view-receipt-title">Receipts</h2>
          <div className="button-group">
            <button className="add" onClick={handleAdd} title="Add Receipt">
              <i className="fas fa-file-medical"></i>
            </button>
            <button
              className="edit"
              onClick={handleEdit}
              disabled={selectedReceipts.length !== 1}
              title="Edit Receipt"
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button
              className="delete"
              onClick={handleDelete}
              disabled={selectedReceipts.length === 0}
              title="Delete Receipt(s)"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="monthFilter">Month</label>
            <input
              type="month"
              id="monthFilter"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="orderedByFilter">Submitter</label>
            <input
              type="text"
              id="orderedByFilter"
              value={orderedByFilter}
              onChange={(e) => setOrderedByFilter(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="reasonFilter">Type</label>
            <select
              id="reasonFilter"
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="snacks">Snacks</option>
              <option value="prasad">Prasad</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>
                Date
                <button
                  className="sort-button"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? "▲" : "▼"}
                </button>
              </th>
              <th>Items</th>
              <th>Vendor</th>
              <th>Reason</th>
              <th>Amount</th>
              <th>Submitter</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {applyFilters(receipts)
              .slice(
                (currentPage - 1) * receiptsPerPage,
                currentPage * receiptsPerPage
              )
              .map((receipt) => (
                <tr key={receipt.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReceipts.includes(receipt.id)}
                      onChange={() => handleCheckboxChange(receipt.id)}
                    />
                  </td>
                  <td>{receipt.date}</td>
                  <td>{receipt.items.join(", ")}</td>
                  <td>{receipt.orderedFrom}</td>
                  <td>
                    {["snacks", "prasad"].includes(receipt.reason)
                      ? receipt.reason
                      : "Other"}
                  </td>
                  <td>{receipt.amount}</td>
                  <td>{receipt.orderedBy}</td>
                  <td>{receipt.attachmentUrl ? "Yes" : "No"}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="5"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total Expense:
              </td>
              <td colSpan="3" style={{ fontWeight: "bold" }}>
                {calculateTotalExpense(applyFilters(receipts))}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(applyFilters(receipts).length / receiptsPerPage)
                )
              )
            }
            disabled={
              currentPage ===
              Math.ceil(applyFilters(receipts).length / receiptsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReceipt;
