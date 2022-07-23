import EventEmitter from "events";
import {createRouter} from "./context";
import {Message} from "@prisma/client";
import {Subscription} from "@trpc/server";

export const wsEventEmitter = new EventEmitter();

// when addMessage is emitted, all clients will receive the message
wsEventEmitter.emit('addMessage', {})
export const websocketRouter = createRouter()
    .subscription('newMessage', {
        resolve({ctx, input}) {
            return new Subscription<Message>(emit => {

                const onAddMessage = (newMessage: Message) => {
                    // send new message to the frontend
                    emit.data(newMessage);
                    console.log("new message: ", newMessage);
                }

                wsEventEmitter.on('addMessage', onAddMessage);

                return () => {
                    wsEventEmitter.off('addMessage', onAddMessage);
                }
            })
        }
    } )



