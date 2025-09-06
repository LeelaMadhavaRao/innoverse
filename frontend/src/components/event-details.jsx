import React from 'react';
import { Card } from './ui/card';

const EventDetails = ({ events }) => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events && events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {event.description}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Start: {new Date(event.startDate).toLocaleDateString()}</p>
                  <p>End: {new Date(event.endDate).toLocaleDateString()}</p>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
              No upcoming events at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
