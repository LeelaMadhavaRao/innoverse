import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { galleryAPI } from '../lib/api';

function Gallery() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      const response = await galleryAPI.getAll();
      setItems(response.data);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await galleryAPI.approve(id);
      loadGalleryItems();
    } catch (err) {
      console.error('Failed to approve item:', err);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'approved') return item.status === 'approved';
    if (filter === 'pending') return item.status === 'pending';
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl">{error}</p>
          <Button 
            onClick={loadGalleryItems} 
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">Event Management</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Project Gallery
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore innovative projects and creative works from our talented participants
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pending Review
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                  <img 
                    src={item.imageUrl || '/placeholder.jpg'} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <Badge 
                      variant={item.status === 'approved' ? 'default' : 'secondary'}
                      className={
                        item.status === 'approved' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }
                    >
                      {item.status === 'approved' ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {item.teamName || 'Anonymous'}
                    </span>
                    {item.needsApproval && (
                      <Button 
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No projects have been submitted yet.' 
                  : `No ${filter} projects found.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-emerald-400">{items.length}</div>
            <div className="text-gray-400">Total Projects</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-green-400">
              {items.filter(item => item.status === 'approved').length}
            </div>
            <div className="text-gray-400">Approved</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400">
              {items.filter(item => item.status === 'pending').length}
            </div>
            <div className="text-gray-400">Pending Review</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
