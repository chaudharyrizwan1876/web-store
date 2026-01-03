// frontend-vite/src/components/products/ProductsGrid.jsx
import React from "react";
import ProductGridCard from "./ProductGridCard";
import PaginationBar from "./PaginationBar";

const ProductsGrid = ({
  items = [],
  page,
  setPage,
  pageCount,
  pageSize,
  setPageSize,
}) => {
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
        {items.map((item) => (
          <ProductGridCard key={item.id} item={item} />
        ))}
      </div>

      <PaginationBar
        page={page}
        setPage={setPage}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        width="920px"
      />
    </div>
  );
};

export default ProductsGrid;
