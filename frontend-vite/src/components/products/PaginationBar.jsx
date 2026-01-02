import React from "react";

const PaginationBar = ({
  page = 1,
  setPage = () => {},
  pageCount = 3,
  pageSize = 10,
  setPageSize = () => {},
  width = "920px",
}) => {
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
        <option value={10}>Show 10</option>
        <option value={20}>Show 20</option>
        <option value={50}>Show 50</option>
      </select>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          style={{
            width: "34px",
            height: "34px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
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
              style={{
                width: "34px",
                height: "34px",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                background: page === n ? "#F3F4F6" : "#fff",
                cursor: "pointer",
                fontWeight: page === n ? 700 : 500,
              }}
            >
              {n}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          style={{
            width: "34px",
            height: "34px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
