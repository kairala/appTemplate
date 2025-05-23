'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'refresh_tokens',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
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
          token: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          expires_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
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

      await queryInterface.addIndex('refresh_tokens', ['user_id'], {
        transaction,
        name: 'refresh_tokens_user_id_idx',
      });

      await queryInterface.addIndex('refresh_tokens', ['token'], {
        transaction,
        name: 'refresh_tokens_token_idx',
      });
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex(
        'refresh_tokens',
        'idx_refresh_tokens_user_id',
        {
          transaction,
        },
      );
      await queryInterface.removeIndex(
        'refresh_tokens',
        'idx_refresh_tokens_token',
        {
          transaction,
        },
      );
      await queryInterface.dropTable('refresh_tokens', { transaction });
    });
  },
};
