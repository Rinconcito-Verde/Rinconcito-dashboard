"use client";

import { Edit, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Product } from "./types";

interface ProductTableProps {
  products: Product[];
  onEditClick: (product: Product) => void;
}

export function ProductTable({ products, onEditClick }: ProductTableProps) {

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.base_price.toFixed(2)} {product.currency}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => onEditClick(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Eliminar producto", product.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
