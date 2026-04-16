import type { OrderStatus, PaymentMethod, PaymentStatus, ShippingCarrier, ShippingStatus } from '@/constants';
import type { BaseEntity } from './common.type';
import type { Product, ProductVariant } from './product.type';

/**
 * Order entity
 */
export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  shippingAddress: ShippingAddressSnapshot;
  subtotal: string;
  shippingCost: string;
  discount: string;
  total: string;
  discountCode: string | null;
  notes: string | null;
  adminNotes: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
  payments?: Payment[];
  shipments?: Shipment[];
}

/**
 * Order item entity
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantAttributes: Record<string, string> | null;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  createdAt: string;
  product?: Product;
  variant?: ProductVariant;
}

/**
 * Shipping address snapshot (stored in order)
 */
export interface ShippingAddressSnapshot {
  recipientName: string;
  phone: string;
  street: string;
  number: string | null;
  apartment: string | null;
  district: string;
  city: string;
  department: string;
  postalCode: string | null;
  reference: string | null;
}

/**
 * Payment entity
 */
export interface Payment extends BaseEntity {
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  currency: string;
  externalId: string | null;
  externalStatus: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  completedAt: string | null;
}

/**
 * Shipment entity
 */
export interface Shipment extends BaseEntity {
  orderId: string;
  carrier: ShippingCarrier;
  status: ShippingStatus;
  trackingNumber: string | null;
  trackingUrl: string | null;
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  department: string;
  postalCode: string | null;
  shippingCost: string;
  weightKg: string | null;
  estimatedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  events?: ShipmentEvent[];
}

/**
 * Shipment event entity
 */
export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShippingStatus;
  location: string | null;
  description: string | null;
  occurredAt: string;
  createdAt: string;
}

/**
 * Create order data
 */
export interface CreateOrderData {
  addressId: string;
  shippingCarrier: ShippingCarrier;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

/**
 * Order filter parameters
 */
export interface OrderFilterParams {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

/**
 * Shipping rate
 */
export interface ShippingRate {
  carrier: ShippingCarrier;
  name: string;
  price: number;
  estimatedDays: string;
  description?: string;
}

/**
 * Checkout summary
 */
export interface CheckoutSummary {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  itemCount: number;
}
