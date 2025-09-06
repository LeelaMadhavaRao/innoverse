import { useState } from 'react';
import { Button } from './ui/button';

function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Add your logic here
    setIsLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800"></div>
      
      {/* Background pattern/overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Academic Excellence &{' '}
          <span className="text-red-400">Cultural Innovation</span>
        </h1>
        
        <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-100">
          Join us for an extraordinary celebration of academic achievement and
          cultural diversity. This three-day summit brings together students, faculty, and
          industry experts to showcase innovative projects, research presentations, and
          cultural performances.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            onClick={handleGetStarted}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'View Event Details'}
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-lg"
          >
            Register Now
          </Button>
        </div>

        {/* Event stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">March 15-17, 2024</div>
            <div className="text-sm text-gray-300">Event Date</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">University Main Auditorium</div>
            <div className="text-sm text-gray-300">Venue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">500+ Students</div>
            <div className="text-sm text-gray-300">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">3 Days</div>
            <div className="text-sm text-gray-300">Duration</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
