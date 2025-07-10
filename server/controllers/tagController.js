const Tag = require('../models/Tag');

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags.map(tag => tag.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

exports.addTags = async (req, res) => {
  const { tags } = req.body;
  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: 'Tags should be an array' });
  }

  const addedTags = [];

  for (const name of tags) {
    try {
      const existing = await Tag.findOne({ name });
      if (!existing) {
        const newTag = await Tag.create({ name });
        addedTags.push(newTag.name);
      } else {
        addedTags.push(existing.name);
      }
    } catch (err) {
      console.error(`Failed to add tag "${name}":`, err.message);
    }
  }

  res.json(addedTags);
};