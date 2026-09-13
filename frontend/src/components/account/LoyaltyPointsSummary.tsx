import type { JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LoyaltyPointsDto } from '@/types/loyalty';
import { Flame } from 'lucide-react';

interface LoyaltyPointsSummaryProps {
  loyaltyPoints: LoyaltyPointsDto | null;
}

export default function LoyaltyPointsSummary({ loyaltyPoints }: LoyaltyPointsSummaryProps): React.JSX.Element {
  return (
    <Card className="shadow-md border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Loyalty Points</CardTitle>
        <Flame className="h-6 w-6 text-[#E87A00]" />
      </CardHeader>
      <CardContent>
        {loyaltyPoints ? (
          <div className="text-2xl font-bold text-[#E87A00]">
            {loyaltyPoints.pointsBalance} Points
          </div>
        ) : (
          <div className="text-md text-gray-500">
            No loyalty points found. Start shopping to earn!
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Thank you for being a valued member of our community!
        </p>
      </CardContent>
    </Card>
  );
}