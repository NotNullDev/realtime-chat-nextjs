import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID ?? "";
const key = process.env.NEXT_PUBLIC_PUSHER_ID ?? "";
const secret = process.env.PUSHER_SECRET ?? "";
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

console.log("[server] Pusher initialized", pusher);

export default pusher;
