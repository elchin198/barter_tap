import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface Advertisement {
  id: number;
  title: string;
  position: 'left' | 'right';
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

interface AdvertisementBannerProps {
  position: 'left' | 'right';
}

const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({ position }) => {
  const [isVisible, setIsVisible] = useState(true);

  const { data: advertisement = {} as Advertisement, isLoading } = useQuery({
    queryKey: ['/api/advertisements', position],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/advertisements/active/${position}`);
        if (!response.ok) return {} as Advertisement;
        return response.json();
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return {} as Advertisement;
      }
    },
    staleTime: 300000, // 5 minutes
  });

  if (!advertisement || !advertisement.active) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed z-10 ${position === 'left' ? 'left-2' : 'right-2'} top-1/3 transform -translate-y-1/2 max-w-[160px]`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-2 flex justify-between items-center bg-gray-50 border-b border-gray-200">
          <span className="text-xs text-gray-500 font-medium">Sponsorlu</span>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        </div>

        <div className="p-2">
          {advertisement.imageUrl ? (
            <a 
              href={advertisement.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <img 
                src={advertisement.imageUrl} 
                alt={advertisement.title || 'Reklam'} 
                className="w-full h-auto"
              />
            </a>
          ) : (
            <div className="bg-gray-100 p-4 text-center text-sm text-gray-500">
              Reklamın şəkli yoxdur
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBanner;