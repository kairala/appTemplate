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
  HasMany,
} from 'sequelize-typescript';
import { UserPermissionGroup } from 'src/db/models/permission/userPermissionGroup.model';

@Table({
  tableName: 'permission_groups',
  timestamps: true,
  underscored: true,
})
export class PermissionGroup extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column
  declare description?: string;

  @HasMany(() => UserPermissionGroup, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare userPermissionGroups: UserPermissionGroup[];

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
