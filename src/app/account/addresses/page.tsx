'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Briefcase,
  Edit2,
  Home,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/loading';
import { Modal } from '@/components/ui/modal';
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from '@/hooks/api';
import { addressSchema, type AddressFormData } from '@/lib/validations';
import { useUIStore } from '@/store';
import type { Address, CreateAddressData } from '@/types';

export default function AddressesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { addToast } = useUIStore();

  const { data: addresses, isLoading } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      isDefault: false,
    },
  });

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      reset({
        label: address.label,
        recipientName: address.recipientName,
        recipientPhone: address.recipientPhone,
        street: address.street,
        number: address.number || '',
        apartment: address.apartment || '',
        district: address.district,
        city: address.city,
        department: address.department,
        postalCode: address.postalCode || '',
        reference: address.reference || '',
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      reset({
        label: '',
        recipientName: '',
        recipientPhone: '',
        street: '',
        number: '',
        apartment: '',
        district: '',
        city: '',
        department: '',
        postalCode: '',
        reference: '',
        isDefault: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    reset();
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateMutation.mutateAsync({
          id: editingAddress.id,
          data: data as CreateAddressData,
        });
        addToast({
          type: 'success',
          title: 'Éxito',
          message: 'Dirección actualizada correctamente',
        });
      } else {
        await createMutation.mutateAsync(data as CreateAddressData);
        addToast({
          type: 'success',
          title: 'Éxito',
          message: 'Dirección agregada correctamente',
        });
      }
      handleCloseModal();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: editingAddress
          ? 'Error al actualizar la dirección'
          : 'Error al agregar la dirección',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Dirección eliminada correctamente',
      });
      setDeletingId(null);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar la dirección',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const addressList = addresses ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Mis Direcciones
          </h2>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar dirección
          </Button>
        </div>

        {addressList.length === 0 ? (
          <div className="py-12 text-center">
            <MapPin className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes direcciones guardadas
            </h3>
            <p className="mt-2 text-gray-600">
              Agrega una dirección para agilizar tus compras
            </p>
            <Button onClick={() => handleOpenModal()} className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Agregar dirección
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addressList.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleOpenModal(address)}
                onDelete={() => setDeletingId(address.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAddress ? 'Editar dirección' : 'Nueva dirección'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Etiqueta"
            {...register('label')}
            error={errors.label?.message}
            placeholder="Ej: Casa, Trabajo, etc."
          />

          <Input
            label="Nombre del destinatario"
            {...register('recipientName')}
            error={errors.recipientName?.message}
          />

          <Input
            label="Teléfono"
            type="tel"
            {...register('recipientPhone')}
            error={errors.recipientPhone?.message}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Calle"
              {...register('street')}
              error={errors.street?.message}
            />
            <Input
              label="Número"
              {...register('number')}
              error={errors.number?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Apartamento/Depto (opcional)"
              {...register('apartment')}
              error={errors.apartment?.message}
            />
            <Input
              label="Distrito/Barrio"
              {...register('district')}
              error={errors.district?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Ciudad"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="Departamento/Región"
              {...register('department')}
              error={errors.department?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Código Postal (opcional)"
              {...register('postalCode')}
              error={errors.postalCode?.message}
            />
            <Input
              label="Referencia (opcional)"
              {...register('reference')}
              error={errors.reference?.message}
              placeholder="Cerca de..."
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Establecer como dirección predeterminada
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingAddress ? 'Guardar cambios' : 'Agregar dirección'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Eliminar dirección"
        size="sm"
      >
        <p className="text-gray-600">
          ¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se
          puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletingId(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => deletingId && handleDelete(deletingId)}
            isLoading={deleteMutation.isPending}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}

function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const getIcon = () => {
    if (address.label?.toLowerCase().includes('trabajo')) {
      return <Briefcase className="h-5 w-5" />;
    }
    return <Home className="h-5 w-5" />;
  };

  return (
    <div className="relative rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md">
      {address.isDefault && (
        <span className="absolute right-4 top-4 rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-600">
          Predeterminada
        </span>
      )}

      <div className="mb-3 flex items-center gap-2 text-gray-600">
        {getIcon()}
        <span className="font-medium text-gray-900">
          {address.label || 'Dirección'}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        <p className="font-medium text-gray-900">
          {address.recipientName}
        </p>
        <p>{address.street} {address.number}</p>
        <p>
          {address.city}, {address.department} {address.postalCode}
        </p>
        <p>{address.district}</p>
        {address.recipientPhone && <p className="mt-2">{address.recipientPhone}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit2 className="mr-1 h-4 w-4" />
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="mr-1 h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}
