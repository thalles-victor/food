export enum STORAGE_PROVIDER {
  S3 = 'S3',
  LOCAL = 'LOCAL',
}

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ROOT = 'ROOT',
}

export enum TABLE {
  user = 'user',
  product = 'product',
  order = 'order',
  order_item = 'order-item',
  order_status = 'order-status',
}

export enum KEY_INJECTION {
  USER_REPOSITORY = 'USER_REPOSITORY',
  PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY',
  ORDER_REPOSITORY = 'ORDER_REPOSITORY',
}

export enum KEY_OF_CACHE {
  PAYPAL_ACCESS_TOKEN = 'PAYPAL_ACCESS_TOKEN',
}
