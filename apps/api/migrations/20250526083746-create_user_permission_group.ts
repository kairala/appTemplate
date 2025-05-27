'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'user_permission_groups',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
          },
          user_id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          permission_group_id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'permission_groups',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
          },
        },
        { transaction },
      );

      await queryInterface.addIndex(
        'user_permission_groups',
        ['user_id', 'permission_group_id'],
        {
          unique: true,
          transaction,
          name: 'user_permission_groups_idx',
        },
      );
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex(
        'user_permission_groups',
        'user_permission_groups_idx',
        {
          transaction,
        },
      );
      await queryInterface.dropTable('user_permission_groups', {
        transaction,
      });
    });
  },
};
