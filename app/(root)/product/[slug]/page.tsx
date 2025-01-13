import AddToCart from "@/components/shared/product/AddToCart";
import ProductImages from "@/components/shared/product/ProductImages";
import ProductPrice from "@/components/shared/product/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getProduct } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

const ProductDetails = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  const cart = await getMyCart();
  if (!product) notFound();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 ">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col gap">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating.toString()} of {product.numReviews} reviews
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:item-center">
                <ProductPrice
                  price={Number(product.price)}
                  className="w-24 rounded-full bg-gray-200 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>price</div>
                  <div>
                    <ProductPrice
                      price={Number(product.price)}
                      className="text-xl"
                    />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Stock</div>
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant={"outline"}>In Stock</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Out Of Stock</Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images[0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
