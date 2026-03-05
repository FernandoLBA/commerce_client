'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Truck,
  Check,
  AlertCircle,
} from 'lucide-react';

import { useCart, useAddresses, useCreateOrder } from '@/hooks/api';
import { useAuthStore, useUIStore } from '@/store';
import { useAuthHydrated } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants/ui';
import { PaymentMethod } from '@/constants/enums';
import type { CreateOrderData } from '@/types';

// Validation schemas
const shippingSchema = yup.object({
  addressId: yup.string().optional(),
  firstName: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('El nombre es requerido'),
    otherwise: (schema) => schema.optional(),
  }),
  lastName: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('El apellido es requerido'),
    otherwise: (schema) => schema.optional(),
  }),
  street: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('La dirección es requerida'),
    otherwise: (schema) => schema.optional(),
  }),
  city: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('La ciudad es requerida'),
    otherwise: (schema) => schema.optional(),
  }),
  state: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('El estado/provincia es requerido'),
    otherwise: (schema) => schema.optional(),
  }),
  postalCode: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('El código postal es requerido'),
    otherwise: (schema) => schema.optional(),
  }),
  country: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('El país es requerido'),
    otherwise: (schema) => schema.optional(),
  }),
  phone: yup.string().when('addressId', {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required('El teléfono es requerido'),
    otherwise: (schema) => schema.optional(),
  }),
});

type ShippingFormData = yup.InferType<typeof shippingSchema>;

const CHECKOUT_STEPS = [
  { id: 1, name: 'Envío', icon: MapPin },
  { id: 2, name: 'Pago', icon: CreditCard },
  { id: 3, name: 'Confirmación', icon: Check },
] as const;

const PAYMENT_METHODS = [
  { id: PaymentMethod.STRIPE, name: 'Tarjeta de crédito', icon: CreditCard },
  { id: PaymentMethod.MERCADOPAGO, name: 'Mercado Pago', icon: CreditCard },
  { id: PaymentMethod.CASH_ON_DELIVERY, name: 'Pago contra entrega', icon: CreditCard },
] as const;

const SHIPPING_COST = 10;
const FREE_SHIPPING_THRESHOLD = 50;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useAuthHydrated();
  const { addToast } = useUIStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.STRIPE
  );
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addressesResponse, isLoading: addressesLoading } = useAddresses();
  const createOrderMutation = useCreateOrder();

  const addresses = addressesResponse ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingSchema),
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(`${ROUTES.AUTH.LOGIN}?redirect=${ROUTES.CHECKOUT.CHECKOUT}`);
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [addresses, selectedAddressId]);

  // Calculate totals
  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + (item.variant?.price ?? item.product?.price ?? 0) * item.quantity,
    0
  ) ?? 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleShippingSubmit = (data: ShippingFormData) => {
    if (selectedAddressId && !showNewAddressForm) {
      setShippingData({ addressId: selectedAddressId });
    } else {
      setShippingData(data);
    }
    setCurrentStep(2);
  };

  const handlePaymentSubmit = () => {
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !cart?.items?.length) return;

    try {
      const orderData: Partial<CreateOrderData> = {
        addressId: shippingData.addressId || '',
        paymentMethod: selectedPaymentMethod,
      };

      await createOrderMutation.mutateAsync(orderData as CreateOrderData);

      addToast({
        type: 'success',
        title: 'Éxito',
        message: '¡Pedido realizado con éxito!',
      });

      router.push(ROUTES.USER.ORDERS);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al procesar el pedido. Intenta de nuevo.',
      });
    }
  };

  if (cartLoading || addressesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-gray-600">
          Agrega productos a tu carrito antes de continuar
        </p>
        <Link href={ROUTES.SHOP.PRODUCTS} className="mt-6 inline-block">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={ROUTES.CHECKOUT.CART}
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver al carrito
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Checkout
          </h1>
        </div>

        {/* Steps indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {CHECKOUT_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center rounded-full p-3 ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:block ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
                {index < CHECKOUT_STEPS.length - 1 && (
                  <div
                    className={`mx-4 h-px w-8 sm:w-16 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Dirección de envío
                </h2>

                {/* Saved addresses */}
                {addresses.length > 0 && !showNewAddressForm && (
                  <div className="mb-6 space-y-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {address.recipientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.department} {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">{address.district}</p>
                          {address.recipientPhone && (
                            <p className="text-sm text-gray-500">{address.recipientPhone}</p>
                          )}
                          {address.isDefault && (
                            <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              Dirección predeterminada
                            </span>
                          )}
                        </div>
                      </label>
                    ))}

                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(true)}
                      className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-600 transition-colors hover:border-primary-600 hover:text-primary-600"
                    >
                      + Agregar nueva dirección
                    </button>
                  </div>
                )}

                {/* New address form */}
                {(showNewAddressForm || addresses.length === 0) && (
                  <form onSubmit={handleSubmit(handleShippingSubmit)}>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="mb-4 text-sm text-primary-600 hover:underline"
                      >
                        ← Usar dirección guardada
                      </button>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Nombre"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                      />
                      <Input
                        label="Apellido"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Dirección"
                          {...register('street')}
                          error={errors.street?.message}
                        />
                      </div>
                      <Input
                        label="Ciudad"
                        {...register('city')}
                        error={errors.city?.message}
                      />
                      <Input
                        label="Estado/Provincia"
                        {...register('state')}
                        error={errors.state?.message}
                      />
                      <Input
                        label="Código Postal"
                        {...register('postalCode')}
                        error={errors.postalCode?.message}
                      />
                      <Input
                        label="País"
                        {...register('country')}
                        error={errors.country?.message}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Teléfono"
                          type="tel"
                          {...register('phone')}
                          error={errors.phone?.message}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button type="submit" className="w-full">
                        Continuar al pago
                      </Button>
                    </div>
                  </form>
                )}

                {/* Continue with selected address */}
                {addresses.length > 0 && !showNewAddressForm && (
                  <Button
                    onClick={() => handleShippingSubmit({ addressId: selectedAddressId || undefined })}
                    disabled={!selectedAddressId}
                    className="w-full"
                  >
                    Continuar al pago
                  </Button>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Método de pago
                </h2>

                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                      />
                      <method.icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                  <Button onClick={handlePaymentSubmit} className="flex-1">
                    Revisar pedido
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Confirmar pedido
                </h2>

                {/* Order items */}
                <div className="mb-6">
                  <h3 className="mb-4 font-medium text-gray-900">Productos</h3>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b border-gray-100 pb-4"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.product?.name || 'Producto'}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              SKU: {item.variant.sku}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency((item.variant?.price ?? item.product?.price ?? 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Envío</span>
                  </div>
                  {selectedAddressId && (
                    <p className="mt-2 text-sm text-gray-600">
                      {addresses.find((a) => a.id === selectedAddressId)?.street}
                    </p>
                  )}
                </div>

                {/* Payment info */}
                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">
                      {PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)?.name}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    isLoading={createOrderMutation.isPending}
                    className="flex-1"
                  >
                    Confirmar pedido
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Resumen del pedido
              </h2>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.items.length} productos)
                  </span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Gratis' : formatCurrency(shipping)}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-primary-600">
                    ¡Agrega {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} más
                    para envío gratis!
                  </p>
                )}
              </div>

              <div className="flex justify-between py-4 text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-500">
                Los impuestos y gastos adicionales se calcularán al finalizar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
