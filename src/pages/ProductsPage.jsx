import { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

export default function ProductsPage() {
  const toast = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productDialog, setProductDialog] = useState(false);
  const [product, setProduct] = useState({
    id: null,
    title: '',
    description: '',
    price: 0,
    brand: '',
    category: '',
    thumbnail: '',
    sku: '',
    returnPolicy: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const openNewProductDialog = () => {
    setProduct({
      id: null,
      title: '',
      description: '',
      price: 0,
      brand: '',
      category: '',
      thumbnail: '',
      sku: '',
      returnPolicy: ''
    });
    setIsEdit(false);
    setProductDialog(true);
  };

  const openEditProductDialog = (prod) => {
    setProduct({ ...prod });
    setIsEdit(true);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setProductDialog(false);
  };

  const saveProduct = async () => {
    if (!product.title.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Atención', detail: 'El título es obligatorio', life: 3000 });
      return;
    }

    // Generar discountPercentage y rating aleatorios
    const discountPercentageRaw = Number((Math.random() * 20).toFixed(2)); // 0 a 20%
    const discountPercentage = discountPercentageRaw > product.price ? Number((product.price * 0.1).toFixed(2)) : discountPercentageRaw;
    const rating = Number((Math.random() * 5).toFixed(2)); // 0 a 5

    if (isEdit) {
      const productToUpdate = {
        ...product,
        discountPercentage,
        rating,
        warrantyInformation: "1 year warranty",
        shippingInformation: "Ships in 2 weeks",
        availabilityStatus: "In Stock",
        returnPolicy: product.returnPolicy || "No return policy"
      };
      try {
        const res = await fetch(`http://localhost:3000/products/${productToUpdate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToUpdate)
        });
        if (!res.ok) throw new Error('Error al actualizar producto');
        const updated = await res.json();

        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      }
    } else {
      const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1;

      const productToSave = {
        ...product,
        id: newId,
        discountPercentage,
        rating,
        warrantyInformation: "1 year warranty",
        shippingInformation: "Ships in 2 weeks",
        availabilityStatus: "In Stock",
        returnPolicy: product.returnPolicy || "No return policy"
      };

      try {
        const res = await fetch(`http://localhost:3000/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToSave)
        });
        if (!res.ok) throw new Error('Error al crear producto');
        const created = await res.json();

        setProducts((prev) => [created, ...prev]);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto agregado', life: 3000 });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      }
    }

    setProductDialog(false);
  };

  const deleteProduct = async (prod) => {
    if (window.confirm(`¿Está seguro que desea eliminar el producto "${prod.title}"?`)) {
      try {
        const res = await fetch(`http://localhost:3000/products/${prod.id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar producto');
        setProducts((prev) => prev.filter((p) => p.id !== prod.id));
        toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado', life: 3000 });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      }
    }
  };

  const actionBodyTemplate = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        onClick={() => openEditProductDialog(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => deleteProduct(rowData)}
      />
    </>
  );

  const thumbnailBodyTemplate = (rowData) => (
    <img
      src={rowData.thumbnail}
      alt={rowData.title}
      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
    />
  );

  return (
    <div className="products-page">
      <Toast ref={toast} />
      <div className="card">
        <h2>Productos</h2>
        <Button label="Nuevo Producto" icon="pi pi-plus" onClick={openNewProductDialog} className="mb-3" />

        <DataTable
          value={products}
          loading={loading}
          paginator
          rows={10}
          responsiveLayout="scroll"
          emptyMessage="No hay productos."
          dataKey="id"
        >
          <Column field="id" header="ID" style={{ width: '5rem' }} />
          <Column header="Imagen" body={thumbnailBodyTemplate} style={{ width: '6rem' }} />
          <Column field="title" header="Título" sortable />
          <Column field="brand" header="Marca" sortable />
          <Column field="price" header="Precio" body={(data) => `$${data.price}`} sortable />
          <Column field="warrantyInformation" header="Garantía" />
          <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: '500px' }}
        header={isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        modal
        onHide={hideDialog}
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="title">Título</label>
            <InputText
              id="title"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              autoFocus
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="description">Descripción</label>
            <InputText
              id="description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="price">Precio</label>
            <InputNumber
              id="price"
              value={product.price}
              onValueChange={(e) => setProduct({ ...product, price: e.value || 0 })}
              mode="currency"
              currency="USD"
              locale="en-US"
              min={0}
              showButtons
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="brand">Marca</label>
            <InputText
              id="brand"
              value={product.brand}
              onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="category">Categoría</label>
            <InputText
              id="category"
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="thumbnail">Thumbnail (URL imagen)</label>
            <InputText
              id="thumbnail"
              value={product.thumbnail}
              onChange={(e) => setProduct({ ...product, thumbnail: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="sku">SKU</label>
            <InputText
              id="sku"
              value={product.sku}
              onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="returnPolicy">Return Policy</label>
            <InputText
              id="returnPolicy"
              value={product.returnPolicy}
              onChange={(e) => setProduct({ ...product, returnPolicy: e.target.value })}
            />
          </div>

          <div className="flex justify-content-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveProduct} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
