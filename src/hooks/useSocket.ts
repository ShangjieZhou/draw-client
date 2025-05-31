import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_DRAW_SERVER_URL;
console.log(URL);
export const socket = io(URL, {
  autoConnect: true,
});

export const useSocket = () => {
  const emitEvent = <T>({ eventName, data }: { eventName: string; data: any }): Promise<T> => {
    return new Promise((resolve, _) => {
      socket.emit(eventName, data, (response: T) => {
        resolve(response);
      });
    });
  };

  const listenToEvent = <T>(eventName: string, handler: (data: T) => void) => {
    socket.on(eventName, handler);

    // Return cleanup function
    return () => socket.off(eventName, handler);
  };

  return {
    emitEvent,
    listenToEvent,
  };
};
