// imageFetcher.ts
import { PIXABAY_API_KEY } from '@env';
import axios from 'axios';

const PIXABAY_URL = 'https://pixabay.com/api/';

export async function fetchPixabayImage(
  query: string,

  lang: string = 'en',
) {
  //   if (!apiKey) {
  //     throw new Error('Missing PIXABAY_API_KEY (got empty/undefined).');
  //   }

  const url = `https://pixabay.com/api/?key=${'52101842-0834da23056c4ca4f628eb513'}&q=${' white rice with salmon'}&lang=${lang}&image_type=photo`;

  try {
    // const { data } = await axios.get(PIXABAY_URL, {

    //   params: {
    //     key: '52101842-0834da23056c4ca4f628eb513', // MUST be valid
    //     q: query,
    //     image_type: 'photo',
    //     orientation: 'horizontal',
    //     category: 'food',
    //     per_page: 3,
    //     safesearch: true,
    //     lang: lang.startsWith('he') ? 'he' : 'en', // <-- correct param
    //   },
    //   timeout: 15000,
    // });
    const response = await fetch(url);
    const data = await response.json(); // Parse the JSON data from the response
    console.log(data);
    const hit = data.hits?.[1];

    // const hit = await response.json();
    // const hit = data?.hits?.[0];
    return hit?.largeImageURL || hit?.webformatURL || null;
  } catch (err: any) {
    const status = err?.response?.status;
    const payload = err?.response?.data;
    throw new Error(
      `Pixabay error ${status ?? ''}: ${JSON.stringify(payload)}`,
    );
  }
}

export function isAllowedCdn(url?: string | null) {
  if (!url) return false;
  return /^(https:\/\/)(images\.pexels\.com|cdn\.pixabay\.com)\/.*\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(
    url,
  );
}
