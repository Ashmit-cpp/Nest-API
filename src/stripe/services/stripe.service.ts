import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from 'src/cart/services/cart.services';
import { CartItem } from 'src/typeorm/entities/cart-item.entity';
import { StripeWebhookEvents } from 'src/utils/enums/webhookEvents.enum';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly endpointSecret: string;
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly cartService: CartService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
    this.endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  async createCheckoutSession(
    cart: {
      id: number;
      items: {
        id: number;
        quantity: number;
        totalPrice: number;
        product: {
          id: number;
          name: string;
          description: string;
          price: number;
          imageUrl: string;
        };
      }[];
    },
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'USD',
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [item.product.imageUrl],
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  }
  async constructEventFromPayload(
    signature: string,
    payload: Buffer,
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case StripeWebhookEvents.CheckoutSessionCompleted:
        // const { metadata, amount_total } = event.data.object;
        // const { products, orderInformation, userId } = metadata;
        // console.log('orderInformation', orderInformation);
        // this.cartService.completeOrder(
        //   {
        //     orderInformation: JSON.parse(orderInformation),
        //     products: JSON.parse(products),
        //     totalPrice: amount_total,
        //   },
        //   userId,
        // );
        this.cartService.completeOrder(event.data);
        break;
    }
  }
  async getSessionDetails(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error('Error retrieving session details:', error);
      throw new Error('Could not retrieve session details');
    }
  }
}
