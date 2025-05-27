'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'permission_group_permissions',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
          },
          permission_group_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'permission_groups',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          permission_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'permissions',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
      await queryInterface.addIndex(
        'permission_group_permissions',
        ['permission_group_id', 'permission_id'],
        {
          unique: true,
          transaction,
          name: 'permission_group_permissions_idx',
        },
      );
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('permission_group_permissions_idx', {
        transaction,
      });
      await queryInterface.dropTable('permission_group_permissions', {
        transaction,
      });
    });
  },
};
