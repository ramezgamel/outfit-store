import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";
import { OrderItem } from "@/types";
import Image from "next/image";

const OrderItemsTable = ({ items }: { items: OrderItem[] }) => {
  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <h2 className="text-2xl pb-4">Order Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((i) => (
              <TableRow key={i.slug}>
                <TableCell>
                  <Link
                    href={`/product/${i.slug}`}
                    className="flex items-center"
                  >
                    <Image src={i.image} width={50} height={50} alt={i.name} />
                    <span className="px-2">{i.name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="px-2">{i.qty}</span>
                </TableCell>
                <TableCell>{i.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderItemsTable;
