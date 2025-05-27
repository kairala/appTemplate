'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'permissions',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          slug: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('permissions', ['slug'], {
        unique: true,
        transaction,
        name: 'permissions_slug_idx',
      });
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('permissions', 'permissions_slug_idx', {
        transaction,
      });
      await queryInterface.dropTable('permissions', { transaction });
    });
  },
};
