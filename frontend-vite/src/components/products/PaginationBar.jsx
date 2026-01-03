// frontend-vite/src/components/products/PaginationBar.jsx
import React from "react";

const PaginationBar = ({
  page = 1,
  setPage = () => {},
  pageCount = 1,
  pageSize = 9,
  setPageSize = () => {},
  width = "920px",
}) => {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div
      style={{
        width,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "12px",
        marginTop: "14px",
      }}
    >
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        style={{
          height: "34px",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "0 10px",
          fontSize: "13px",
          background: "#fff",
        }}
      >
        <option value={9}>Show 9</option>
        <option value={18}>Show 18</option>
        <option value={27}>Show 27</option>
      </select>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canPrev}
          style={{
            width: "34px",
            height: "34px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            cursor: canPrev ? "pointer" : "not-allowed",
            opacity: canPrev ? 1 : 0.45,
          }}
        >
          ‹
        </button>

        {Array.from({ length: pageCount }).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              disabled={n === page}
              style={{
                width: "34px",
                height: "34px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                background: page === n ? "#F3F4F6" : "#fff",
                cursor: n === page ? "default" : "pointer",
                fontWeight: page === n ? 700 : 500,
                opacity: n === page ? 1 : 1,
              }}
            >
              {n}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={!canNext}
          style={{
            width: "34px",
            height: "34px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            cursor: canNext ? "pointer" : "not-allowed",
            opacity: canNext ? 1 : 0.45,
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
