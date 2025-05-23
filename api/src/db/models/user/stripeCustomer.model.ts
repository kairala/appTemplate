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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PlanEnum } from './plans.enum';
import { User } from './user.model';

@Table({
  tableName: 'stripe_customers',
  timestamps: true,
  underscored: true,
})
export class StripeCustomer extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Index({ name: 'stripe_customers_user_id_idx' })
  @Column({ type: DataType.STRING })
  declare customerId?: string;

  @Index({ name: 'stripe_customers_subscription_id_idx' })
  @Column({ type: DataType.STRING })
  declare subscriptionId?: string;

  @Column({ type: DataType.BOOLEAN })
  declare subscriptionWontRenew?: boolean;

  @Column({ type: DataType.STRING, defaultValue: PlanEnum.FREE })
  declare currentPlan: PlanEnum;

  @NotNull
  @Column({ allowNull: false })
  @Index({ name: 'stripe_customers_user_id_idx', unique: true })
  @ForeignKey(() => User)
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;
}
