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
import { PermissionGroup } from 'src/db/models/permission/permissionGroup.model';
import { User } from 'src/db/models/user/user.model';

@Table({
  tableName: 'user_permission_groups',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'permission_group_id'],
      name: 'user_permission_groups_idx',
    },
  ],
})
export class UserPermissionGroup extends Model {
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
  @ForeignKey(() => User)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
