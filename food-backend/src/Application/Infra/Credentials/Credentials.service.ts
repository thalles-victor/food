import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { env } from 'process';
import { KEY_OF_CACHE } from 'src/Application/@shared/metadata';

export class CredentialsService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getPaypalAccessToken() {
    let accessToken = await this.cacheManager.get(
      KEY_OF_CACHE.PAYPAL_ACCESS_TOKEN,
    );

    if (!accessToken) {
      accessToken = this.generateNewPaypalAccessToken();
    }

    return accessToken;
  }

  private async generateNewPaypalAccessToken() {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString('base64');

    const url = `${env.PAYPAL_BASE_URL}/v1/oauth2/token`;

    try {
      const response = await this.httpService.axiosRef(url, {
        method: 'POST',
        data: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      await this.cacheManager.set(
        KEY_OF_CACHE.PAYPAL_ACCESS_TOKEN,
        accessToken,
        expiresIn - 1000, // remove 1s to avoid error.
      );

      return accessToken;
    } catch (e) {
      console.log('Erro ao obter o token: ', e.response.data);
      throw new InternalServerErrorException();
    }
  }
}
