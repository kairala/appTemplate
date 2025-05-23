'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  async up(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'storage_files',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
          },

          provider: {
            type: Sequelize.ENUM('S3'),
            allowNull: false,
            defaultValue: 'S3',
            comment: 'The storage engine the file is stored',
          },
          provider_ref: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'The path in the storage service the file was stored',
          },
          mimetype: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: 'The mimetype of the file',
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            comment: 'The user that uploaded the file',
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
        {
          comment: 'This table has the data stored files in the application',
        },
        { transaction },
      );
    });
  },

  // @ts-expect-error -- Sequelize CLI does not support TypeScript
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // @ts-expect-error -- Sequelize CLI does not support TypeScript
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('storage_files', {
        transaction,
      });
    });
  },
};
