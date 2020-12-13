import { WebClient } from '@slack/web-api';

export enum SlackChannels {
  'Backgrounds' = 'backgrounds',
  'Tv' = 'tv',
}

export type SlackbotDTO = {
  bot: WebClient;
  channel: SlackChannels;
  text?: string;
};
