import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Api from "../services/Api";
import "../css/AddReceipt.css";

const AddReceipt = () => {
  const [date, setDate] = useState("");
  const [items, setItems] = useState("");
  const [orderedFrom, setOrderedFrom] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [amount, setAmount] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [orderedBy, setOrderedBy] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.orderedBy) {
      setOrderedBy(location.state.orderedBy);
    } else {
      setOrderedBy(Api.getCurrentUser() || "");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("date", date);
    formData.append("items", items);
    formData.append("orderedFrom", orderedFrom);
    formData.append("reason", reason === "other" ? otherReason : reason);
    formData.append("amount", amount);
    formData.append("orderedBy", orderedBy);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      await Api.addReceipt(formData);
      navigate("/viewreceipt");
    } catch (error) {
      console.error("Failed to add receipt:", error);
    }
  };

  const handleCancel = () => {
    setDate("");
    setItems("");
    setOrderedFrom("");
    setReason("");
    setOtherReason("");
    setAmount("");
    setAttachment(null);
    setOrderedBy("");
  };

  return (
    <div className="add-receipt-container">
      <form onSubmit={handleSubmit} className="add-receipt-form">
        <h2>Add Receipt</h2>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="items">Items</label>
          <input
            type="text"
            id="items"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="orderedFrom">Vendor</label>
          <input
            type="text"
            id="orderedFrom"
            value={orderedFrom}
            onChange={(e) => setOrderedFrom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select a reason</option>
            <option value="snacks">Snacks</option>
            <option value="prasad">Prasad</option>
            <option value="other">Other</option>
          </select>
        </div>
        {reason === "other" && (
          <div className="form-group">
            <label htmlFor="otherReason">Specify Other Reason</label>
            <input
              type="text"
              id="otherReason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="attachment">Attachment</label>
          <input
            type="file"
            id="attachment"
            onChange={(e) => setAttachment(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label htmlFor="orderedBy">Ordered By</label>
          <input
            type="text"
            id="orderedBy"
            value={orderedBy}
            onChange={(e) => setOrderedBy(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReceipt;
