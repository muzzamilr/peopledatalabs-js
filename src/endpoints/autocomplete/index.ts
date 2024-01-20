import axios from 'axios';

import { check, errorHandler } from '../../errors.js';
import type { AutoCompleteParams, AutoCompleteResponse } from '../../types/autocomplete-types.js';
import { parseRateLimitingResponse } from '../../utils/api-utils.js';

export default (
  basePath: string,
  apiKey: string,
  params: AutoCompleteParams,
) => new Promise<AutoCompleteResponse>((resolve, reject) => {
  check(params, basePath, apiKey, null, 'autocomplete').then(() => {
    const {
      field,
      text,
      size,
      pretty,
      beta,
    } = params;

    const autocompleteParams = {
      field,
      text: text || '',
      size: size || 10,
      pretty: pretty || false,
      beta: beta || false,
    };

    const headers = {
      'Accept-Encoding': 'gzip',
      'User-Agent': 'PDL-JS-SDK',
    };

    axios.get<AutoCompleteResponse>(`${basePath}/autocomplete`, {
      params: {
        api_key: apiKey,
        ...autocompleteParams,
      },
      headers,
    })
      .then((response) => {
        if (response?.data?.status === 200) {
          resolve(parseRateLimitingResponse(response));
        }
      })
      .catch((error) => {
        reject(errorHandler(error));
      });
  }).catch((error) => {
    reject(error);
  });
});
