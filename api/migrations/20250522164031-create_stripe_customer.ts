'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'stripe_customers',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
          },
          customer_id: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          subscription_id: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
          },
          subscription_wont_renew: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          current_plan: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'free',
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

      await queryInterface.addIndex('stripe_customers', ['user_id'], {
        transaction,
        name: 'stripe_customers_user_id_idx',
        unique: true,
      });

      await queryInterface.addIndex('stripe_customers', ['customer_id'], {
        transaction,
        name: 'stripe_customers_customer_id_idx',
      });

      await queryInterface.addIndex('stripe_customers', ['subscription_id'], {
        transaction,
        name: 'stripe_customers_subscription_id_idx',
      });
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex(
        'stripe_customers',
        'stripe_customers_user_id_idx',
        {
          transaction,
        },
      );
      await queryInterface.removeIndex(
        'stripe_customers',
        'stripe_customers_customer_id_idx',
        {
          transaction,
        },
      );
      await queryInterface.removeIndex(
        'stripe_customers',
        'stripe_customers_subscription_id_idx',
        {
          transaction,
        },
      );
      await queryInterface.dropTable('stripe_customers', { transaction });
    });
  },
};
