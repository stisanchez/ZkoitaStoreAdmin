import { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export default function UsersPage() {
  const toast = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userDialog, setUserDialog] = useState(false);
  const [user, setUser] = useState({
    id: null,
    firstName: '',
    lastName: '',
    maidenName: '',
    age: null,
    gender: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    birthDate: '',
    image: '',
    university: '',
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const openNewUserDialog = () => {
    setUser({
      id: null,
      firstName: '',
      lastName: '',
      maidenName: '',
      age: null,
      gender: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      birthDate: '',
      image: '',
      university: '',
    });
    setIsEdit(false);
    setUserDialog(true);
  };

  const openEditUserDialog = (usr) => {
    setUser({ ...usr });
    setIsEdit(true);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setUserDialog(false);
  };

  const addUser = async (newUser) => {
    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (!res.ok) throw new Error('Error al crear usuario');
    return await res.json();
  };

  const updateUser = async (id, updatedFields) => {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    return await res.json();
  };

  const deleteUserApi = async (id) => {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
    return await res.json();
  };

  const saveUser = async () => {
    if (!user.firstName.trim() || !user.username.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Atención', detail: 'Nombre y usuario son obligatorios', life: 3000 });
      return;
    }

    try {
      if (isEdit) {
        const updatedUser = await updateUser(user.id, user);
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado', life: 3000 });
      } else {
        const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) + 1 : 1;
        const userToSave = { ...user, id: newId };

        const newUser = await addUser(userToSave);
        setUsers((prev) => [newUser, ...prev]);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario agregado', life: 3000 });
      }
      setUserDialog(false);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'No se pudo guardar el usuario', life: 3000 });
    }
  };

  const deleteUser = async (usr) => {
    if (window.confirm(`¿Está seguro que desea eliminar el usuario "${usr.username}"?`)) {
      try {
        await deleteUserApi(usr.id);
        setUsers((prev) => prev.filter((u) => u.id !== usr.id));
        toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado', life: 3000 });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'No se pudo eliminar el usuario', life: 3000 });
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
        onClick={() => openEditUserDialog(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => deleteUser(rowData)}
      />
    </>
  );

  const imageBodyTemplate = (rowData) => (
    <img
      src={rowData.image}
      alt={rowData.firstName}
      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
      onError={(e) => (e.target.src = 'https://via.placeholder.com/50')} // fallback image
    />
  );

  return (
    <div className="users-page">
      <Toast ref={toast} />
      <div className="card">
        <h2>Usuarios</h2>
        <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={openNewUserDialog} className="mb-3" />

        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          responsiveLayout="scroll"
          emptyMessage="No hay usuarios."
          dataKey="id"
        >
          <Column field="id" header="ID" style={{ width: '5rem' }} />
          <Column header="Foto" body={imageBodyTemplate} style={{ width: '6rem' }} />
          <Column field="firstName" header="Nombre" sortable />
          <Column field="lastName" header="Apellido" sortable />
          <Column field="username" header="Usuario" sortable />
          <Column field="email" header="Correo" sortable />
          <Column header="Acciones" body={actionBodyTemplate} style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>

      <Dialog
        visible={userDialog}
        style={{ width: '500px' }}
        header={isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
        modal
        onHide={hideDialog}
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="firstName">Nombre</label>
            <InputText
              id="firstName"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              autoFocus
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="lastName">Apellido</label>
            <InputText
              id="lastName"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="maidenName">Apellido de soltera</label>
            <InputText
              id="maidenName"
              value={user.maidenName}
              onChange={(e) => setUser({ ...user, maidenName: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="age">Edad</label>
            <InputText
              id="age"
              type="number"
              value={user.age || ''}
              onChange={(e) => setUser({ ...user, age: e.target.value ? Number(e.target.value) : null })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="gender">Género</label>
            <InputText
              id="gender"
              value={user.gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="email">Correo</label>
            <InputText
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="phone">Teléfono</label>
            <InputText
              id="phone"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="username">Usuario</label>
            <InputText
              id="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="password">Contraseña</label>
            <InputText
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <InputText
              id="birthDate"
              type="date"
              value={user.birthDate}
              onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="image">URL Imagen</label>
            <InputText
              id="image"
              value={user.image}
              onChange={(e) => setUser({ ...user, image: e.target.value })}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="university">Universidad</label>
            <InputText
              id="university"
              value={user.university}
              onChange={(e) => setUser({ ...user, university: e.target.value })}
            />
          </div>

          <div className="flex justify-content-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUser} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
