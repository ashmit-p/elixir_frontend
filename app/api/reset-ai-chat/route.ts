import { io } from 'socket.io-client';

export async function POST(req: Request): Promise<Response> {
  try {
    const { roomId } = await req.json();

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token: process.env.NEXT_PUBLIC_SOCKET_TOKEN! },
    });

    return new Promise((resolve) => {
      socket.emit('reset_chat', roomId);

      socket.on('chat_reset_success', () => {
        resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
        socket.disconnect();
      });

      socket.on('error', (err) => {
        resolve(new Response(JSON.stringify({ error: err }), { status: 500 }));
        socket.disconnect();
      });
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
