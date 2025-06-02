import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Trash2, Plus, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { products } from '../../data/products';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl: string;
  updatedAt?: Date;
}

const columnHelper = createColumnHelper<Product>();

const ProductsPage: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-secondary-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-secondary-300"
        />
      ),
    }),
    columnHelper.accessor('imageUrl', {
      header: 'Image',
      cell: (info) => (
        <div className="w-12 h-12">
          <img
            src={info.getValue()}
            alt=""
            className="w-full h-full object-cover rounded"
          />
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1"
        >
          Name
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
    }),
    columnHelper.accessor('price', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1"
        >
          Price
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor('category', {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting()}
          className="flex items-center gap-1"
        >
          Category
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
    }),
    columnHelper.accessor('available', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue()
            ? 'bg-success-100 text-success-800'
            : 'bg-error-100 text-error-800'
        }`}>
          {info.getValue() ? 'Available' : 'Out of Stock'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:text-primary-600">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-error-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="input max-w-xs"
          />
          <select className="input w-40">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-medium text-secondary-600"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-secondary-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to 10 of {products.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary px-4 py-2 text-sm"
              disabled
            >
              Previous
            </button>
            <button
              className="btn-secondary px-4 py-2 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;