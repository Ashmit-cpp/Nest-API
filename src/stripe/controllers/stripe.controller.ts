import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from '../services/stripe.service';
import { RequestWithRawBody } from 'src/types/stripe.interface';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body()
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
  ) {
    const successUrl = `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    console.log(successUrl);

    const cancelUrl = `${process.env.CLIENT_URL}/cancel`;

    return this.stripeService.createCheckoutSession(
      cart,
      successUrl,
      cancelUrl,
    );
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RequestWithRawBody, @Res() res: Response) {
    const signature = req.headers['stripe-signature'] as string;

    try {
      const event = await this.stripeService.constructEventFromPayload(
        signature,
        req.rawBody,
      );
      this.stripeService.handleWebhookEvent(event);
      res.status(HttpStatus.OK).json({ received: true });
    } catch (err) {
      console.error('Error handling webhook event:', err.message);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

  @Get('session/:sessionId')
  async getSessionDetails(@Param('sessionId') sessionId: string) {
    const sessionDetails =
      await this.stripeService.getSessionDetails(sessionId);
    return sessionDetails;
  }
}
