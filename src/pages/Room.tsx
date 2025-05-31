import { useNavigate, useParams } from 'react-router-dom';
import { socket, useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';

export default function Room() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [players, setPlayers] = useState<string[]>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const { emitEvent, listenToEvent } = useSocket();

  const joinRoom = async () => {
    const players = await emitEvent({
      eventName: 'join_room',
      data: {
        roomId,
      },
    });
    setIsJoined(true);
    setPlayers(players as string[]);
  };

  const leaveRoom = async () => {
    await emitEvent({
      eventName: 'leave_room',
      data: { roomId },
    });
    navigate('/');
  };

  useEffect(() => {
    joinRoom();

    const handlePlayerJoined = (data: { playerId: string }) => {
      setPlayers((prev) => {
        return prev.includes(data.playerId) ? prev : [...prev, data.playerId];
      });
    };

    const handlePlayerLeft = (data: { playerId: string }) => {
      setPlayers((prev) => prev.filter((player) => player !== data.playerId));
    };

    listenToEvent('player_joined', handlePlayerJoined);
    listenToEvent('player_left', handlePlayerLeft);
    // Cleanup function to remove event listener
    return () => {
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_left', handlePlayerLeft);
    };
  }, [roomId]);

  return (
    <div>
      {isJoined ? (
        <div className="flex flex-col items-center justify-center h-screen">
          Current Players:
          <div className="flex flex-col items-center justify-center">
            {players.map((player) => (
              <div key={player}>{player}</div>
            ))}
          </div>
          <button className="bg-red-500 text-white p-2 rounded-md" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
