import { Product } from "@/types";
import ProductCart from "./ProductCard";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {limitedData.map((product: Product) => (
            <ProductCart key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center">No products found</div>
      )}
    </div>
  );
};

export default ProductList;
