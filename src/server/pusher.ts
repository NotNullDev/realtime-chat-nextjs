import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID ?? "";
const key = process.env.NEXT_PUBLIC_PUSHER_KEY ?? "";
const secret = process.env.PUSHER_SECRET ?? "";
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";

const pusherHost = process.env.NEXT_PUBLIC_PUSHER_HOST ?? "";
const pusherPort = process.env.NEXT_PUBLIC_PUSHER_PORT ?? "";

const pusher = new Pusher({
  host: pusherHost,
  port: pusherPort,
  appId,
  key,
  secret,
  cluster,
  useTLS: false,
});

console.log("[server] Pusher initialized", pusher);

export default pusher;
