import { WorkoutSession } from "@prisma/client";

export const SessionNotes = ({
  workoutSessions,
}: {
  workoutSessions: WorkoutSession[];
}) => {
  // Näkymän urlissa pitää olla workoutId jotta voi hakea kaikki sessiot sille workoutille
  // Hae vaan kaikki missä notes exists: true
  return (
    <div>
      {workoutSessions.map((session) => (
        <div className="chat chat-start">
          {/* <div className="chat-header">
            Obi-Wan Kenobi
            <time className="text-xs opacity-50">2 hour ago</time>
      </div> */}
          <div className="chat-bubble">{session.notes}</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
      ))}
    </div>
  );
};
