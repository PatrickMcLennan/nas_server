import { WebClient, WebAPICallResult } from '@slack/web-api';

export function slackPost(
  bot: WebClient,
  text: string
): Promise<void | WebAPICallResult> {
  return new Promise((res) =>
    bot.chat
      .postMessage({ channel: `backgrounds`, text })
      .then(res)
      .catch((err) => {
        console.error(err);
        res();
      })
  );
}
