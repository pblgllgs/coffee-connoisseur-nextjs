import { findRecordByFilterWithId, table } from '../../utils/airtable';
import { normalizeRecords } from '../../utils/normalize';

const upvoteCoffeeStore = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.body;
    try {
      if (!id) {
        return res.status(406).json({ message: 'field id is missing' });
      }
      const record = await findRecordByFilterWithId(id);
      const { voting, recordId } = record[0];
      const calcVote = parseInt(voting) + 1;
      const updatedRecord = await table.update([
        {
          id: recordId,
          fields: {
            voting: calcVote
          }
        }
      ]);
      if (!updatedRecord) {
        return res.status(400).json({ message: 'bad request' });
      }
      const normalizeUpdatedRecord = normalizeRecords(updatedRecord);
      res.status(202).json(normalizeUpdatedRecord);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export default upvoteCoffeeStore;
