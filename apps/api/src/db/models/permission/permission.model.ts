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
  Index,
} from 'sequelize-typescript';

@Table({
  tableName: 'permissions',
  timestamps: true,
  underscored: true,
})
export class Permission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column
  declare description?: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  @Index({ name: 'permissions_slug_idx', unique: true })
  declare slug: string;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
