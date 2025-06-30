import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface RideReceiptProps {
  ride: {
    id: string;
    from_location: string;
    to_location: string;
    departure_date: string;
    departure_time: string;
    seats_requested: number;
    price: number;
    booking_type: string;
    status: string;
    payment_reference?: string;
    created_at: string;
  };
}

const RideReceipt = ({ ride }: RideReceiptProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const card = cardRef.current;
    if (!card) return;
    const canvas = await html2canvas(card, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Fit image to page width, keep aspect ratio
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(`uniride-receipt-${ride.id.slice(0, 8)}.pdf`);
  };

  return (
    <Card ref={cardRef} className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Car className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Uniride Receipt</CardTitle>
        </div>
        <Badge variant={ride.status === "completed" ? "default" : "secondary"}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-mono">{ride.id.slice(0, 8)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date Booked:</span>
            <span>{format(new Date(ride.created_at), "PPP")}</span>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Trip Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Trip Details</h4>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>
              {ride.from_location} → {ride.to_location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{format(new Date(ride.departure_date), "PPP")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{ride.departure_time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span>
              {ride.seats_requested}{" "}
              {ride.seats_requested === 1 ? "passenger" : "passengers"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-gray-500" />
            <span>
              {ride.booking_type === "full" ? "Full Ride" : "Seat Booking"}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Payment Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Payment Details</h4>
          So
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ride Fare:</span>
            <span>₦{ride.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Booking Fee:</span>
            <span>₦500</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between font-semibold">
            <span>Total Paid:</span>
            <span className="text-green-600">
              ₦{(ride.price + 500).toLocaleString()}
            </span>
          </div>
          {ride.payment_reference && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CreditCard className="h-3 w-3" />
              <span>Ref: {ride.payment_reference}</span>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-2">
          <p>Thank you for choosing Uniride!</p>
          <p>Contact: support@uniride.ng</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideReceipt;
