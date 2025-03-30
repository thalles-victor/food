import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { env } from 'process';
import { PaypalGenerateUrlProps } from 'src/Application/@shared/types';
import { CredentialsService } from '../Credentials/Credentials.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly credentialsService: CredentialsService,
  ) {}

  async paypalGenerateUrl(props: PaypalGenerateUrlProps) {
    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          invoice_id: props.order.id,
          amount: {
            currency_code: 'BRL',
            value: props.order.totalPrice,
            breakdown: {
              item_total: props.order.items.map((item) => ({
                currency_code: item.currencyCode,
                value: item.price,
              })),
            },
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            landing_page: 'LOGIN',
            shipping_preference: 'GET_FROM_FILE',
            user_action: 'PAY_NOW',
            return_url: `${env.FRONTEND_PAYMENT_REDIRECT_URL}`,
            cancel_url: `${env.BACKEND_PROTOCOL}://${env.BACKEND_DOMAIN}:${env.PORT}/paypal/cancel`,
          },
        },
      },
    };

    const paypalAccessToken =
      await this.credentialsService.getPaypalAccessToken();

    try {
      const paymentResult = await this.httpService.axiosRef.post(
        `${env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        body, // Corpo da requisição
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paypalAccessToken}`,
          },
        },
      );

      if (!paymentResult.data) {
        throw new InternalServerErrorException(
          'Payment failed: No data received from PayPal',
        );
      }

      return paymentResult.data;
    } catch (error) {
      console.error('Error creating PayPal order:', error.message);

      throw new InternalServerErrorException('Payment failed');
    }
  }
}
