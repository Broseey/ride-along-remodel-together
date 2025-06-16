
import React from "react";

interface MapTokenHandlerProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenHandler: React.FC<MapTokenHandlerProps> = ({ onTokenSubmit }) => {
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('token') as string;
    if (token) {
      onTokenSubmit(token);
    }
  };

  return (
    <div className="h-48 rounded-md mb-3 border border-gray-200 flex items-center justify-center bg-gray-50">
      <div className="text-center p-4">
        <p className="text-sm text-gray-600 mb-3">
          Please enter your Mapbox public token to view the map
        </p>
        <form onSubmit={handleTokenSubmit} className="space-y-2">
          <input
            type="text"
            name="token"
            placeholder="pk.eyJ..."
            className="w-full px-3 py-2 border rounded text-sm"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
          >
            Load Map
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Get your token at{' '}
          <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500">
            mapbox.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default MapTokenHandler;
