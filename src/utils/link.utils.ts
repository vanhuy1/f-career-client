import { URL_REGEX } from '../constants/regex.constants';

export const websiteLinkCreator = (url: string) => {
  const parsedURL = '';
  if (url.startsWith('http') && url.match(URL_REGEX)) {
    return url;
  }
  const withHTTP = url.startsWith('http://') || url.startsWith('https://');
  const withWWW = url.startsWith('www.');
  if (!withHTTP && withWWW) return parsedURL.concat('https://', url);
  if (!withHTTP && !withWWW) return parsedURL.concat('https://', url);
  return 'Invalid Link';
};

export const resolvedWebsiteLink = (link: string): string => {
  try {
    let urlString = link;
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      urlString = `https://${link}`;
    }
    const url = new URL(urlString);
    return url.hostname;
  } catch (error: unknown) {
    return (error as Error).message;
  }
};
