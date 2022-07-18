import { ChatMessage } from "../pages";

export const createMessage = async (message: ChatMessage) => {
    return await global.prisma?.message.create({
        data: {
            author: message.author,
            content: message.content
        }
    });
};

export const addMessage = async (messages: ChatMessage[]) => {

    messages.forEach(async (message) => {
        await createMessage(message);
    });

};
