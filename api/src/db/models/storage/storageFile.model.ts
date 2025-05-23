import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  NotNull,
  CreatedAt,
  UpdatedAt,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({
  tableName: 'storage_files',
  timestamps: true,
  underscored: true,
})
export class StorageFile extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({
    type: DataType.ENUM('S3'),
    allowNull: false,
    defaultValue: 'S3',
  })
  declare provider: 'S3';

  @NotNull
  @Column({ allowNull: false })
  declare providerRef: string;

  @NotNull
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => User)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare mimetype: string;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
