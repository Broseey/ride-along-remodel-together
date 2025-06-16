
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Clock, User } from "lucide-react";

interface Activity {
  id: string;
  type: 'booking' | 'departure' | 'arrival' | 'driver_online';
  message: string;
  time: Date;
  status: 'active' | 'completed' | 'pending';
}

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'booking',
      message: 'New ride booked: Lagos → UI',
      time: new Date(Date.now() - 2 * 60000),
      status: 'active'
    },
    {
      id: '2',
      type: 'departure',
      message: 'Driver departed: Ikeja Terminal',
      time: new Date(Date.now() - 5 * 60000),
      status: 'active'
    },
    {
      id: '3',
      type: 'driver_online',
      message: 'Driver Emmanuel O. came online',
      time: new Date(Date.now() - 8 * 60000),
      status: 'completed'
    }
  ]);

  useEffect(() => {
    // Simulate real-time activity updates
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: ['booking', 'departure', 'arrival', 'driver_online'][Math.floor(Math.random() * 4)] as Activity['type'],
        message: [
          'New ride booked: Abuja → ABU',
          'Driver arrived at pickup point',
          'Ride completed successfully',
          'Driver John D. came online'
        ][Math.floor(Math.random() * 4)],
        time: new Date(),
        status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)] as Activity['status']
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'booking': return <Car className="h-4 w-4 text-blue-500" />;
      case 'departure': return <MapPin className="h-4 w-4 text-orange-500" />;
      case 'arrival': return <MapPin className="h-4 w-4 text-green-500" />;
      case 'driver_online': return <User className="h-4 w-4 text-purple-500" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Live Activity</CardTitle>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-48 overflow-y-auto">
          {activities.map((activity, index) => (
            <div key={activity.id} className={`flex items-start p-3 border-b last:border-b-0 ${index === 0 ? 'bg-blue-50/30' : ''}`}>
              <div className="mr-3 mt-1">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.message}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
