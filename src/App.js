import React, { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedYear, setSelectedYear] = useState(null);
  const [pyqs, setPyqs] = useState(() => {
    const saved = localStorage.getItem("pyqs");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [uploadModal, setUploadModal] = useState(false);
  const [form, setForm] = useState({
    year: "",
    branch: "",
    subject: "",
    file: null,
  });

  useEffect(() => {
    localStorage.setItem("pyqs", JSON.stringify(pyqs));
  }, [pyqs]);

  const branchColors = {
    CSE: "#2563eb", // Blue
    ECE: "#16a34a", // Green
    ME: "#f59e0b", // Orange
    CE: "#dc2626", // Red
    EE: "#9333ea", // Purple
  };

  const handleUpload = () => {
    if (!form.year || !form.branch || !form.subject || !form.file) return;
    const newPYQ = {
      id: Date.now(),
      ...form,
      likes: 0,
      url: URL.createObjectURL(form.file),
    };
    setPyqs([...pyqs, newPYQ]);
    setUploadModal(false);
    setForm({ year: "", branch: "", subject: "", file: null });
  };

  const filteredPYQs = pyqs.filter(
    (p) =>
      (!selectedYear || p.year === selectedYear) &&
      (p.subject.toLowerCase().includes(search.toLowerCase()) ||
        p.branch.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.title}>📘 NIT Agartala PYQ Hub</h1>
        <div>
          <button style={styles.navButton} onClick={() => setPage("home")}>
            Home
          </button>
          <button style={styles.navButton} onClick={() => setUploadModal(true)}>
            Upload
          </button>
        </div>
      </div>

      {/* Home Page */}
      {page === "home" && (
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Choose Your Year</h2>
          <div style={styles.grid}>
            {[
              { year: "1st Year", color: "#f87171" },
              { year: "2nd Year", color: "#fbbf24" },
              { year: "3rd Year", color: "#34d399" },
              { year: "4th Year", color: "#60a5fa" },
            ].map(({ year, color }) => (
              <button
                key={year}
                style={{
                  ...styles.card,
                  background: color,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
                onClick={() => {
                  setSelectedYear(year);
                  setPage("year");
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year Page */}
      {page === "year" && (
        <div style={styles.sectionContainer}>
          <button style={styles.backButton} onClick={() => setPage("home")}>
            ← Back
          </button>
          <h2 style={styles.sectionTitle}>{selectedYear} PYQs</h2>

          <input
            type="text"
            placeholder="Search by subject or branch..."
            style={styles.searchBox}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={styles.grid}>
            {filteredPYQs.length > 0 ? (
              filteredPYQs.map((pyq) => (
                <div key={pyq.id} style={styles.card}>
                  <h3>{pyq.subject}</h3>
                  <p
                    style={{
                      color: branchColors[pyq.branch] || "#374151",
                      fontWeight: "bold",
                    }}
                  >
                    {pyq.branch}
                  </p>
                  <div style={styles.buttonGroup}>
                    <a
                      href={pyq.url}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.linkButton}
                    >
                      Preview
                    </a>
                    <a href={pyq.url} download style={styles.linkButton}>
                      Download
                    </a>
                    <button
                      style={styles.likeButton}
                      onClick={() =>
                        setPyqs(
                          pyqs.map((p) =>
                            p.id === pyq.id ? { ...p, likes: p.likes + 1 } : p
                          )
                        )
                      }
                    >
                      👍 {pyq.likes}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No PYQs uploaded yet for this year.</p>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Upload PYQ</h2>
            <select
              style={styles.input}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
            <select
              style={styles.input}
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
            >
              <option value="">Select Branch</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>ME</option>
              <option>CE</option>
              <option>EE</option>
            </select>
            <input
              style={styles.input}
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <input
              type="file"
              style={styles.input}
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            />

            <div style={styles.buttonGroup}>
              <button style={styles.navButton} onClick={handleUpload}>
                Upload
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => setUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    background: "#ffffff",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem",
    background: "#1f2937",
    color: "white",
  },
  title: { fontSize: "1.25rem", fontWeight: "bold" },
  navButton: {
    background: "#3b82f6",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    margin: "0 0.25rem",
  },
  backButton: {
    background: "#f87171",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    margin: "0.5rem 0",
  },
  cancelButton: {
    background: "#6b7280",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  sectionContainer: { padding: "1rem" },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "white",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    textAlign: "center",
  },
  searchBox: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginBottom: "1rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
    marginTop: "0.5rem",
  },
  linkButton: {
    background: "#10b981",
    color: "white",
    padding: "0.25rem 0.75rem",
    borderRadius: "6px",
    textDecoration: "none",
  },
  likeButton: {
    background: "#f59e0b",
    color: "white",
    padding: "0.25rem 0.75rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginBottom: "0.5rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "1rem",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
  },
};
