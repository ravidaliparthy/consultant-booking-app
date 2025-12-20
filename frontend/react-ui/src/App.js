import React, { useEffect, useState } from "react";
import { getSlots, addSlot, bookSlot, cancelSlot, deleteSlot } from "./api";
import "./App.css";

export default function App() {
  const [slots, setSlots] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const load = async () => {
    const res = await getSlots(page, search, status);
    setSlots(res.data);
    setTotalPages(res.totalPages);
  };

  useEffect(() => { load(); }, [page, search, status]);

  const createSlot = async () => {
    if (!date || !time) {
      alert("Select date and time");
      return;
    }
    await addSlot(`${date} ${time}`);
    setDate("");
    setTime("");
    load();
  };

  return (
    <div className="app">
      <h1>Consultant Booking</h1>

      {/* Date Picker */}
      <div className="controls">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={createSlot}>Add Slot</button>
      </div>

      {/* Search + Filter */}
      <div className="controls">
        <input
          placeholder="Search by time"
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value); }}
        />
        <select
          value={status}
          onChange={e => { setPage(1); setStatus(e.target.value); }}
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </select>
      </div>

      {slots.length === 0 && <p>No slots found</p>}

      <ul>
        {slots.map(s => (
          <li key={s.id}>
            {s.time} — <b>{s.booked ? "Booked" : "Available"}</b>
       <button
          onClick={() => {
          if (window.confirm("Delete this slot?")) {
              deleteSlot(s.id).then(load);
                      }
                  }}
               >
              Delete
          </button>
            {!s.booked && <button onClick={() => bookSlot(s.id).then(load)}>Book</button>}
            {s.booked && <button onClick={() => cancelSlot(s.id).then(load)}>Cancel</button>}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
