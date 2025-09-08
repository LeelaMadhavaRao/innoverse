import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { posterLaunchAPI } from '../lib/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { useBackgroundMusic } from '../hooks/use-background-music';
import { MusicControls } from '../components/music-controls';

export default function PosterLaunch() {
  const [config, setConfig] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Background music for poster launch page
  const music = useBackgroundMusic('/innoverse.mp3', {
    autoPlay: false,
    loop: true,
    volume: 1.0,
    fadeInDuration: 3000,
    fadeOutDuration: 2000
  });

  useEffect(() => {
    fetchData();
    // Set up SSE connection for real-time updates
    const eventSource = new EventSource('/api/poster-launch/events');
    
    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setEvents((prev) => [newEvent, ...prev]);
    };

    // Start background music when page loads and poster launch is active
    const musicTimer = setTimeout(() => {
      if (music.isLoaded && !loading) {
        music.play();
      }
    }, 1000);

    return () => {
      eventSource.close();
      clearTimeout(musicTimer);
      if (music.isPlaying) {
        music.stop();
      }
    };
  }, [music.isLoaded, loading]);

  // Auto-play music when page is loaded and ready
  useEffect(() => {
    if (music.isLoaded && !loading && config) {
      const timer = setTimeout(() => {
        if (!music.isPlaying) {
          music.play();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [music.isLoaded, loading, config]);

  const fetchData = async () => {
    try {
      const [configResponse, eventsResponse] = await Promise.all([
        posterLaunchAPI.getConfig(),
        posterLaunchAPI.getEvents()
      ]);
      setConfig(configResponse.data);
      setEvents(eventsResponse.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch poster launch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading poster launch data...</p>
        </div>
      </div>
    );
  }

  const isActive = config && new Date(config.startDate) <= new Date() && new Date() <= new Date(config.endDate);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Music Controls */}
      <MusicControls
        isPlaying={music.isPlaying}
        onPlay={music.play}
        onPause={music.pause}
        onStop={music.stop}
        volume={music.currentVolume}
        onVolumeChange={music.setVolume}
        isVisible={!loading && config}
        position="bottom-right"
      />

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
              <Link to="/gallery" className="text-gray-300 hover:text-white transition-colors">
                Gallery
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
            🚀 Poster Launch Event
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time updates and announcements for the poster presentation event
          </p>
        </div>

        {/* Event Status Card */}
        <Card className="bg-gray-800 border-gray-700 mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Event Status</h2>
              <Badge 
                variant={isActive ? 'default' : 'secondary'}
                className={`text-lg px-4 py-2 ${
                  isActive 
                    ? 'bg-green-600 text-white animate-pulse' 
                    : 'bg-red-600 text-white'
                }`}
              >
                {isActive ? '🟢 Live Event' : '🔴 Event Inactive'}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-emerald-400">Current Status</h3>
                <p className={`text-2xl font-bold mb-4 ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {isActive ? 'Event is Currently Live!' : 'Event is Not Active'}
                </p>
                <p className="text-gray-400">
                  {isActive 
                    ? 'Participants can now submit their posters and view real-time updates.'
                    : 'Please check back during the scheduled event time.'
                  }
                </p>
              </div>
              
              {config && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-emerald-400">Event Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3">🕒 Start:</span>
                      <span className="text-white font-medium">
                        {new Date(config.startDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3">🏁 End:</span>
                      <span className="text-white font-medium">
                        {new Date(config.endDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Event Updates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Live Event Updates</h2>
            <Button 
              onClick={fetchData}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Refresh Updates
            </Button>
          </div>
          
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event._id} className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <h3 className="text-lg font-semibold text-white">{event.type}</h3>
                      </div>
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3">{event.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">📢</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No updates yet</h3>
                <p className="text-gray-500">
                  Live updates will appear here during the event
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="inline-flex space-x-4">
            <Link to="/gallery">
              <Button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-lg">
                View Gallery
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg">
                Team Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
