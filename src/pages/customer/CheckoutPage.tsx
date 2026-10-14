import { CartCheckout } from '@/components/cart/CartCheckout';
import { useStoreUI } from '@/hooks/useStoreUI';

export default function CheckoutPage() {
  const { compact, notify, go } = useStoreUI();
  return <CartCheckout checkout compact={compact} notify={notify} go={go} />;
}
