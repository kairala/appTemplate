'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'forgot_password_tokens',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
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
          used_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.DataTypes.NOW,
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.DataTypes.NOW,
          },
        },
        {
          transaction,
        },
      );

      await queryInterface.addIndex('forgot_password_tokens', ['user_id'], {
        transaction,
        name: 'idx_forgot_password_tokens_user_id',
      });

      await queryInterface.addIndex('forgot_password_tokens', ['token'], {
        transaction,
        name: 'idx_forgot_password_tokens_token',
        unique: true,
      });
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex(
        'forgot_password_tokens',
        'idx_forgot_password_tokens_user_id',
        { transaction },
      );
      await queryInterface.removeIndex(
        'forgot_password_tokens',
        'idx_forgot_password_tokens_token',
        { transaction },
      );

      await queryInterface.dropTable('forgot_password_tokens', { transaction });
    });
  },
};
