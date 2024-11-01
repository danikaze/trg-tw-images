import type { TweetServiceType, TweetService, TweetServiceStatic } from '.';
import { Twitter } from './twitter';

export function getTweetService(type: TweetServiceType): TweetService {
  const allEnabled = getEnabledTweetServices();
  const service = allEnabled.filter(
    (Service) => Service.serviceName === type
  )[0];

  if (!service) {
    throw new Error(`TweetService "${type}" not found or not enabled.`);
  }

  return service;
}

export function getEnabledTweetServices(): TweetService[] {
  const ALL_SERVICES = [Twitter];

  return ALL_SERVICES.reduce((all, Service) => {
    if (Service.isEnabled()) {
      all.push(new Service());
    }
    return all;
  }, [] as TweetService[]);
}
