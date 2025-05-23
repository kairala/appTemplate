import { PlanEnum } from '../../../../db/models/user/plans.enum';

export class MeResponseDto {
  id: string;
  email: string;
  name: string;
  verified: boolean;

  plan: PlanEnum;

  usedCaptionsToday: number;
}
