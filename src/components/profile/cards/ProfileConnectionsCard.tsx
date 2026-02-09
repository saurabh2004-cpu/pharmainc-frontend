import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ConnectionRequest {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export const ProfileConnectionsCard = () => {
  const router = useRouter();
  
  // Mock connection requests
  const [requests, setRequests] = useState<ConnectionRequest[]>([
    {
      id: "1",
      name: "Dr. Emily Clark",
      role: "Neurologist",
      avatarUrl: "/user4.png",
    },
    {
      id: "2",
      name: "Dr. Raj Singh",
      role: "Pediatrician",
      avatarUrl: "/user5.png",
    },
    {
      id: "3",
      name: "Dr. Anika Mehta",
      role: "Cardiologist",
      avatarUrl: "/user6.png",
    },
  ]);

  const acceptRequest = (id: string) => {
    // Replace with API call
    setRequests((prev) => prev.filter((req) => req.id !== id));
    console.log("Accepted request:", id);
  };

  const rejectRequest = (id: string) => {
    // Replace with API call
    setRequests((prev) => prev.filter((req) => req.id !== id));
    console.log("Rejected request:", id);
  };

  const seeAllRequests = () => {
    // Navigate to my-networks page with connections tab
    router.push('/my-networks?tab=connections');
  };

  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Connection Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.length === 0 && (
          <div className="text-center text-gray-500">No connection requests</div>
        )}
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={req.avatarUrl} alt={req.name} />
                <AvatarFallback>{req.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{req.name}</div>
                <div className="text-sm text-gray-600">{req.role}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => rejectRequest(req.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
              <Button size="sm" onClick={() => acceptRequest(req.id)}>
                Accept
              </Button>
            </div>
          </div>
        ))}

        {requests.length > 0 && (
          <Button
            variant="ghost"
            className="w-full mt-2 text-sm text-blue-600"
            onClick={seeAllRequests}
          >
            See all connection requests
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
