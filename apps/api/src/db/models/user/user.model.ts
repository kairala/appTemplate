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
  HasMany,
  HasOne,
  AfterCreate,
} from 'sequelize-typescript';
import { ProviderEnum } from './provider.enum';
import * as bcrypt from 'bcrypt';
import { ConfirmationToken } from './confirmationToken.model';
import { ForgotPasswordToken } from './forgotPasswordToken.model';
import { RefreshToken } from './refreshToken.model';
import { StorageFile } from '../storage/storageFile.model';
import { StripeCustomer } from './stripeCustomer.model';
import { UserPermissionGroup } from 'src/db/models/permission/userPermissionGroup.model';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @NotNull
  @Unique
  @Index({ name: 'users_email_unique_idx', unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING })
  declare password?: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.DATE })
  declare verifiedAt?: Date;

  @NotNull
  @Column({ type: 'user_provider_enum', allowNull: false })
  declare provider: ProviderEnum;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare providerId: string;

  @NotNull
  @Column({ allowNull: false })
  @CreatedAt
  declare createdAt: Date;

  @NotNull
  @Column({ allowNull: false })
  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => ConfirmationToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare confirmationTokens: ConfirmationToken[];

  @HasMany(() => RefreshToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare refreshTokens: RefreshToken[];

  @HasMany(() => ForgotPasswordToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare forgotPasswordTokens: ForgotPasswordToken[];

  @HasMany(() => StorageFile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare storageFiles: StorageFile[];

  @HasOne(() => StripeCustomer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare stripeCustomer: StripeCustomer;

  @HasMany(() => UserPermissionGroup, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare permissionGroups?: UserPermissionGroup[];

  public async validatePassword(password: string) {
    if (!this.password) {
      return false;
    }

    const passwordCompared = await bcrypt.compare(password, this.password);

    return passwordCompared;
  }

  @AfterCreate({ name: 'create_stripe_customer' })
  static async createStripeCustomer(instance: User, options: any) {
    await StripeCustomer.create(
      {
        userId: instance.id,
        currentPlan: 'free',
      },
      { transaction: options.transaction },
    );
  }
}
