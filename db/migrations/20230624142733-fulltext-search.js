const vectorName = '_search';

const searchObjects = {
  Restaurants: ['name', 'address', 'phone'],
  Menus: ['"itemName"'],
};

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (t) => {
      for (const table in searchObjects) {
        await queryInterface.sequelize.query(
          `ALTER TABLE "${table}" ADD COLUMN ${vectorName} TSVECTOR;`,
          { transaction: t }
        );
        await queryInterface.sequelize.query(
          `UPDATE "${table}" SET ${vectorName} = to_tsvector('pg_catalog.simple', coalesce(${searchObjects[
            table
          ].join(" || ' ' || ")},''));`,
          { transaction: t }
        );
        await queryInterface.sequelize.query(
          `CREATE INDEX ${table}_search ON "${table}" USING gin(${vectorName});`,
          { transaction: t }
        );
        await queryInterface.sequelize.query(
          ` CREATE TRIGGER ${table}_vector_update BEFORE INSERT OR UPDATE ON "${table}" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.english', ${searchObjects[
            table
          ].join(', ')});`,
          { transaction: t }
        );
      }
    });
  },

  /* eslint-disable no-unused-vars */
  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (t) => {
      for (const table in searchObjects) {
        await queryInterface.sequelize.query(
          `DROP TRIGGER ${table}_vector_update ON "${table}";`,
          { transaction: t }
        );
        await queryInterface.sequelize.query(`DROP INDEX ${table}_search;`, {
          transaction: t,
        });
        await queryInterface.sequelize.query(
          `ALTER TABLE "${table}" DROP COLUMN ${vectorName};`,
          { transaction: t }
        );
      }
    });
  },
};
