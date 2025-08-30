import React from "react";

export interface EventInfo {
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  roomColor?: string; // e.g., "#ec407a"
  instructorColor?: string; // e.g., "#ff7043"
}

interface Props {
  event: EventInfo;
}

const EventHoverCard: React.FC<Props> = ({ event }) => {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-4 min-w-[300px] z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-pink-400 text-white text-xs flex items-center justify-center">
            ↻
          </div>
          <h2 className="text-lg font-semibold">{event.title}</h2>
        </div>
        <div className="text-gray-400 cursor-pointer hover:text-gray-600 text-sm">✎</div>
      </div>

      <p className="text-sm mt-1 text-gray-600">{event.date}</p>

      <div className="flex items-center mt-2 text-sm text-gray-700">
        <span className="mr-2">⏰</span>
        {event.time}
      </div>

      <div className="flex items-center mt-2 text-sm">
        <span
          className="w-3 h-3 rounded-full inline-block mr-2"
          style={{ backgroundColor: event.roomColor || "#ec407a" }}
        ></span>
        {event.location}
      </div>

      <div className="flex items-center mt-1 text-sm">
        <span
          className="w-3 h-3 rounded-full inline-block mr-2"
          style={{ backgroundColor: event.instructorColor || "#ff7043" }}
        ></span>
        {event.instructor}
      </div>
    </div>
  );
};

export default EventHoverCard;