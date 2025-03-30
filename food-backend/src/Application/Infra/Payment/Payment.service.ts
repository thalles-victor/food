import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaypalGenerateUrlProps } from 'src/Application/@shared/types';
import { CredentialsService } from '../Credentials/Credentials.service';
import { env } from 'src/Application/@shared/env';

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
              item_total: {
                currency_code: 'BRL',
                value: props.order.totalPrice,
              },
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
            return_url: `${env.FRONTEND_URL}/${env.FRONTEND_PAYMENT_REDIRECT}`,
            cancel_url: `${env.BACKEND_PROTOCOL}://${env.BACKEND_PORT}/${env.BACKEND_DOMAIN}:${env.BACKEND_PORT}/paypal/cancel`,
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

  async WebHookVerification(body: any, headers: any) {
    const paypalAccessToken =
      await this.credentialsService.getPaypalAccessToken();

    const verificationData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: env.WEB_HOOK_ID, // Substitua pelo seu Webhook ID do PayPal
      webhook_event: body,
    };
    try {
      const response = await this.httpService.axiosRef.post(
        `${env.PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
        verificationData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paypalAccessToken}`,
          },
        },
      );

      if (response.data.verification_status !== 'SUCCESS') {
        throw new HttpException('Sgnature invalid', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
