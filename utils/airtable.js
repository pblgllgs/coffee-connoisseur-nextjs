import Airtable from 'airtable';
import { normalizeRecords, normalizeRecordsWithId } from './normalize';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

export const table = base('coffee-store');

export const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`
    })
    .firstPage();
  return normalizeRecords(findCoffeeStoreRecord);
};

export const findRecordByFilterWithId = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`
    })
    .firstPage();
  return normalizeRecordsWithId(findCoffeeStoreRecord);
};
