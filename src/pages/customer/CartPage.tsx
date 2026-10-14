import { CartCheckout } from '@/components/cart/CartCheckout';
import { useStoreUI } from '@/hooks/useStoreUI';

export default function CartPage() {
  const { compact, notify, go } = useStoreUI();
  return <CartCheckout checkout={false} compact={compact} notify={notify} go={go} />;
}
