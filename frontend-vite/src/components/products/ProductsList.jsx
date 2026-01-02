import React, { useState } from "react";
import ProductListItem from "./ProductListItem";
import PaginationBar from "./PaginationBar";

const ProductsList = ({ items = [] }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        pageCount={3}
        pageSize={pageSize}
        setPageSize={setPageSize}
        width="920px"
      />
    </div>
  );
};

export default ProductsList;
