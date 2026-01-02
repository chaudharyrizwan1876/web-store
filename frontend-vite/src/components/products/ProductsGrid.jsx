import React, { useState } from "react";
import ProductGridCard from "./ProductGridCard";
import PaginationBar from "./PaginationBar";

const ProductsGrid = ({ items = [] }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div style={{ width: "920px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 295px)",
          columnGap: "17px",
          rowGap: "20px",
        }}
      >
        {items.slice(0, 9).map((item) => (
          <ProductGridCard key={item.id} item={item} />
        ))}
      </div>

      {/* ✅ Same pagination as list view */}
      <PaginationBar
        page={page}
        setPage={setPage}
        pageCount={3}
        pageSize={pageSize}
        setPageSize={setPageSize}
        width="920px"
      />
    </div>
  );
};

export default ProductsGrid;
``