import { slackClient } from "./slack/client.js";
import { getMessageThreadTool, GetMessageThreadParams } from "./tools/getMessageThread.js";
import { searchMessagesTool, SearchMessagesParams } from "./tools/searchMessages.js";



async function main() {
    // get slack client
    const slack = slackClient;

    // call search messages tool
    const searchParams: SearchMessagesParams = { 
        query: "langfuse",
        messageCount: 1,
        includeThreads: false,
        threadCount: 10,
        sortMessages: "mostRelevant"
    };
    const messageSearchResult = await searchMessagesTool(slack, searchParams);
    console.log(JSON.stringify(messageSearchResult, null, 2));
    console.log(`Got ${messageSearchResult.messages.length} messages`);
    const message = messageSearchResult.messages[0];
    const messageChannel = message.channelId;
    const messageId = message.ts;
    const messageDetailsParams: GetMessageThreadParams = {
        channelId: messageChannel,
        ts: messageId,
        threadCount: 50
    };
    const messageDetailsResult = await getMessageThreadTool(slack, messageDetailsParams);
    console.log(JSON.stringify(messageDetailsResult, null, 2));

}

main();