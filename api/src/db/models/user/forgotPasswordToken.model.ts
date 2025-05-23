import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  NotNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  Default,
  Index,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'forgot_password_tokens',
  timestamps: true,
  underscored: true,
})
export class ForgotPasswordToken extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @NotNull
  @Unique
  @Index({ name: 'forgot_password_tokens_user_id_idx', unique: true })
  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => User)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @NotNull
  @Column({ type: DataType.TEXT, allowNull: false })
  declare token: string;

  @NotNull
  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @Column({ type: DataType.DATE })
  declare usedAt?: Date;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
