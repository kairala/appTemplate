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
import { StorageFile } from '../storage/storageFile.model';

@Table({
  tableName: 'captions',
  timestamps: true,
  underscored: true,
})
export class Caption extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare usedPrompt: string;

  @NotNull
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => StorageFile)
  declare storageFileId: string;

  @BelongsTo(() => StorageFile)
  declare storageFile?: StorageFile;

  @NotNull
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => User)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare processingTime: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare style: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare network: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  declare keywords: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  declare labels: string[];

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
