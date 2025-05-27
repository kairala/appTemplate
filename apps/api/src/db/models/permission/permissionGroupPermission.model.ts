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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Permission } from 'src/db/models/permission/permission.model';
import { PermissionGroup } from 'src/db/models/permission/permissionGroup.model';

@Table({
  tableName: 'permission_group_permissions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['permission_group_id', 'permission_id'],
      name: 'permission_group_permissions_idx',
    },
  ],
})
export class PermissionGroupPermission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @NotNull
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => PermissionGroup)
  declare permissionGroupId: string;

  @BelongsTo(() => PermissionGroup)
  declare permissionGroup?: PermissionGroup;

  @NotNull
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => Permission)
  declare permissionId: string;

  @BelongsTo(() => Permission)
  declare permission?: Permission;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
