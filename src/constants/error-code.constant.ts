export enum ErrorCode {
  // Common Validation
  V000 = 'common.validation.error',

  // Validation
  V001 = 'user.validation.is_empty',
  V002 = 'user.validation.is_invalid',

  // Error
  E001 = 'user.error.username_or_email_exists',
  E002 = 'user.error.not_found',
  E003 = 'user.error.email_exists',
  E004 = 'user.error.invalid_token',

  E100 = 'common.error.image_max_size_exceeded',
  E101 = 'common.error.invalid_image_file_type',

  E200 = 'shop.error.shop_name_exists',

  E301 = 'category.error.name_exists',
  E302 = 'category.error.slug_exists',
  E303 = 'category.error.not_found',

  E400 = 'attribute.error.name_exists',
  E401 = 'attribute.error.not_found',
  E450 = 'attribute.value.error.exists',
  E451 = 'attribute.value.error.not_found',
}
