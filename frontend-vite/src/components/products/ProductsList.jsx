// frontend-vite/src/components/products/ProductsList.jsx
import React from "react";
import ProductListItem from "./ProductListItem";
import PaginationBar from "./PaginationBar";

const ProductsList = ({
  items = [],
  page,
  setPage,
  pageCount,
  pageSize,
  setPageSize,
}) => {
  return (
    <div style={{ width: "920px", height: "1430px", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px" }}>
        {items.map((item) => (
          <ProductListItem key={item.id} item={item} />
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

export default ProductsList;
