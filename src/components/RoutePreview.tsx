
import React from "react";
import RoutePreviewMap from "./RoutePreviewMap";

interface RoutePreviewProps {
  from: string;
  to: string;
  fromType: "university" | "state";
  toType: "university" | "state";
}

const RoutePreview: React.FC<RoutePreviewProps> = ({ from, to, fromType, toType }) => {
  return <RoutePreviewMap from={from} to={to} fromType={fromType} toType={toType} />;
};

export default RoutePreview;
