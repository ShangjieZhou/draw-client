import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';

export default function Entry() {
  const { emitEvent } = useSocket();
  const navigate = useNavigate();

  const createRoom = async () => {
    const roomId = await emitEvent<string>({
      eventName: 'create_room',
      data: {},
    });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-4">
      <button className="bg-blue-500 text-white p-2 rounded-md w-48">Join Room</button>
      <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded-md w-48">
        Create Room
      </button>
    </div>
  );
}
