'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE TYPE "user_provider_enum" AS ENUM('local', 'google', 'apple')`,
        { transaction },
      );

      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            allowNull: false,
            comment: 'User ID',
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'User email address',
          },
          password: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'User password',
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'User name',
          },
          verified_at: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'User verification date',
          },
          provider: {
            type: 'user_provider_enum',
            allowNull: false,
            comment: 'User provider (the idp where the user was created)',
          },
          provider_id: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'User provider ID (the idp where the user was created)',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email_unique_idx',
        transaction,
      });
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('users', 'users_email_unique_idx', {
        transaction,
      });

      await queryInterface.dropTable('users', { transaction });

      await queryInterface.sequelize.query(`DROP TYPE "user_provider_enum"`, {
        transaction,
      });
    });
  },
};
