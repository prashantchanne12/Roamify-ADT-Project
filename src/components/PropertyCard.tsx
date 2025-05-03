import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PropertyProps {
  property: {
    _id: string;
    title: string;
    type: string;
    location: {
      city: string;
      country: string;
    };
    price: {
      regular: number;
      discounted?: number;
    };
    images: Array<{
      url: string;
      isMain: boolean;
    }>;
    ratings: {
      average: number;
      count: number;
    };
  };
  showSaveButton?: boolean;
}

const PropertyCard: React.FC<PropertyProps> = ({ property, showSaveButton = true }) => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [saved, setSaved] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isAuthenticated && user?.savedProperties) {
      setSaved(user.savedProperties.includes(property._id));
    }
  }, [isAuthenticated, user?.savedProperties, property._id]);

  const mainImage = property.images.find(img => img.isMain) || property.images[0];

  const handleSaveProperty = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please login to save properties', {
        icon: '🔒',
      });
      return;
    }

    try {
      const action = saved ? 'unsave' : 'save';
      const response = await axios.patch(`/api/users/saved-properties/${property._id}`, { action });
      updateUser({ savedProperties: response.data });
      setSaved(!saved);
      toast(saved ? 'Property removed from saved list' : 'Property saved to your list', {
        icon: saved ? '🗑️' : '❤️',
      });
    } catch (error) {
      console.error('Error updating saved properties:', error);
      toast.error('Failed to update saved properties');
    }
  };

  return (
    <Link to={`/property/${property._id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-64 overflow-hidden">
          <img
            src={mainImage.url}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {showSaveButton && (
            <button
              onClick={handleSaveProperty}
              className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus:outline-none z-10"
              aria-label={saved ? "Unsave property" : "Save property"}
            >
              <Heart
                className={`h-5 w-5 ${saved ? 'fill-secondary-500 text-secondary-500' : 'text-neutral-500'}`}
              />
            </button>
          )}

          {property.price.discounted && (
            <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Special Offer
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                {property.title}
              </h3>
              <p className="text-neutral-600 text-sm mb-2">
                {property.location.city}, {property.location.country}
              </p>
            </div>

            <div className="flex items-center">
              <Star className="h-4 w-4 text-accent-500 fill-accent-500 mr-1" />
              <span className="text-sm font-medium">
                {property.ratings.average} 
                <span className="text-neutral-500 ml-1">
                  ({property.ratings.count})
                </span>
              </span>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-neutral-800 font-medium">
              {property.price.discounted ? (
                <>
                  <span className="text-secondary-500">${property.price.discounted}</span>
                  <span className="text-neutral-500 text-sm line-through ml-1">
                    ${property.price.regular}
                  </span>
                </>
              ) : (
                <>${property.price.regular}</>
              )}
              <span className="text-neutral-500 text-sm"> / night</span>
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-200">
            <span className="text-sm text-neutral-600 inline-flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
              {property.type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;