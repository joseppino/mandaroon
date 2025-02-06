import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import json from "$lib/hsk1-words.json"

export const load: PageLoad = async () => {
	// const jsonFile = json;
  // const hskJson = await jsonFile.json();

  console.log(json);
  return {
    dataset: json
  }

	error(404, 'Not found');
};