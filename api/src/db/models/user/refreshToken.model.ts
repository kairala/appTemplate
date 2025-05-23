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
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
})
export class RefreshToken extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @NotNull
  @Column({ allowNull: false })
  @ForeignKey(() => User)
  @Index({ name: 'refresh_tokens_user_id_idx' })
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @NotNull
  @Index({ name: 'refresh_tokens_token_idx' })
  @Column({ allowNull: false })
  declare token: string;

  @NotNull
  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
