import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentStepProps {
  orderTotal: number;
  onPaymentSuccess: (paymentGatewayOrderId: string) => void;
}

export function PaymentStep({ orderTotal, onPaymentSuccess }: PaymentStepProps): React.JSX.Element {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const handlePayment = async (): Promise<void> => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error('Please fill in all payment details.');
      setIsProcessing(false);
      return;
    }

    // Simulate success or failure
    const isSuccess = Math.random() > 0.1; // 90% success rate for simulation

    if (isSuccess) {
      const paymentGatewayOrderId = `PG-${Date.now()}`;
      toast.success('Payment successful!');
      onPaymentSuccess(paymentGatewayOrderId);
    } else {
      toast.error('Payment failed. Please try again.');
    }
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your purchase for {formatCurrency(orderTotal)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            data-testid="payment-card-number"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              data-testid="payment-expiry-date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              placeholder="XXX"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              data-testid="payment-cvv"
            />
          </div>
        </div>
        <Button
          onClick={handlePayment}
          className="w-full bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          disabled={isProcessing}
          data-testid="payment-submit"
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(orderTotal)}`}
        </Button>
      </CardContent>
    </Card>
  );
}