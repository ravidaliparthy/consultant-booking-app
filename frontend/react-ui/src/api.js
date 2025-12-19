const API = "http://localhost:3000/api";

export const getSlots = (page, search, status) =>
  fetch(`${API}/slots?page=${page}&search=${search}&status=${status}`)
    .then(res => res.json());

export const addSlot = (time) =>
  fetch(`${API}/slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time })
  });

export const bookSlot = (slotId) =>
  fetch(`${API}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Demo User",
      email: "demo@mail.com",
      slotId
    })
  }).then(res => res.json());

export const cancelSlot = (slotId) =>
  fetch(`${API}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotId })
  });
