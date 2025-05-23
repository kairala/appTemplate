'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'captions',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          text: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          used_prompt: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          storage_file_id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'storage_files',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
          processing_time: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          style: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: true,
          },
          network: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: true,
          },
          keywords: {
            type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING(20)),
            allowNull: true,
            defaultValue: [],
          },
          labels: {
            type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING(100)),
            allowNull: true,
            defaultValue: [],
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
        { transaction },
      );

      await queryInterface.addIndex('captions', ['user_id'], {
        name: 'captions_user_id_index',
        transaction,
      });
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('captions', 'captions_user_id_index', {
        transaction,
      });
      await queryInterface.dropTable('captions', { transaction });
    });
  },
};
