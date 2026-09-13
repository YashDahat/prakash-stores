import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
type AuthUser = { username: string; role: string };

interface ProfileDetailsProps {
  user: AuthUser | null;
}

export default function ProfileDetails({ user }: ProfileDetailsProps): React.JSX.Element {
  return (
    <Card className="shadow-md border border-gray-100 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg font-medium">Username:</p>
          <p className="text-[#212121]">{user?.username || 'N/A'}</p>
        </div>
        <Separator />
        <div>
          <p className="text-lg font-medium">Role:</p>
          <p className="text-[#212121]">{user?.role || 'N/A'}</p>
        </div>
        <Separator />
        <div>
          <p className="text-lg font-medium">Saved Addresses:</p>
          <p className="text-[#212121]">No saved addresses yet.</p>
          {/* Placeholder for future address display */}
        </div>
      </CardContent>
    </Card>
  );
}