import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DeliveryOptionsProps {
  onSelectDeliveryMethod: (method: 'standard' | 'clickAndCollect') => void;
  selectedMethod: 'standard' | 'clickAndCollect';
}

export default function DeliveryOptions({
  onSelectDeliveryMethod,
  selectedMethod,
}: DeliveryOptionsProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#212121]">Delivery Options</h2>
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value: 'standard' | 'clickAndCollect') => onSelectDeliveryMethod(value)}
        className="grid gap-4"
        data-testid="delivery-options-radio-group"
      >
        <div className="flex items-center space-x-2 p-4 border rounded-md shadow-sm bg-white">
          <RadioGroupItem value="standard" id="standard-shipping" data-testid="standard-shipping-radio" />
          <Label htmlFor="standard-shipping" className="flex flex-col cursor-pointer">
            <span className="font-medium">Standard Shipping</span>
            <span className="text-sm text-gray-500">Estimated delivery: 3-5 business days</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-md shadow-sm bg-white">
          <RadioGroupItem value="clickAndCollect" id="click-and-collect" data-testid="click-and-collect-radio" />
          <Label htmlFor="click-and-collect" className="flex flex-col cursor-pointer">
            <span className="font-medium">Click and Collect</span>
            <span className="text-sm text-gray-500">
              Pickup at Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020
            </span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}