/* eslint-disable indent */
const { Sequelize } = require('../db/models');

const fullTextSearch = (req, models) => {
  const fullSearch = req.query.search
    ? [
        Sequelize.literal(
          `to_tsvector(concat_ws(
              ' ',
             ${models}
          )) @@  plainto_tsquery('${req.query.search}:*')`
        ),
      ]
    : [];
  return fullSearch;
};

module.exports = {
  fullTextSearch,
};
