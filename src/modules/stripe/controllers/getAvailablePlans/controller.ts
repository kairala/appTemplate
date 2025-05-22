import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { STRIPE_CLIENT } from '../../providers';
import Stripe from 'stripe';

@Controller('stripe/products')
@ApiTags('Stripe')
export class GetAvailableProductsController {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private productsCache: (Stripe.Product & {
    prices?: Stripe.Price[];
    features?: Stripe.ProductFeature[];
  })[];

  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  @Get()
  @ApiOperation({
    summary: 'Get available plans',
    description: 'Get available plans',
  })
  async getAvailablePlans() {
    if (this.productsCache) {
      return this.productsCache;
    }

    const products = await this.stripe.products.list({
      active: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    const result: (Stripe.Product & {
      prices?: Stripe.Price[];
      features?: Stripe.ProductFeature[];
    })[] = products.data;

    for (const product of result) {
      const prices = await this.stripe.prices.list({
        product: product.id,
        active: true,
      });

      const features = await this.stripe.products.listFeatures(product.id, {});

      product.features = features.data;
      product.prices = prices.data;
    }

    this.productsCache = result;

    return result;
  }
}
