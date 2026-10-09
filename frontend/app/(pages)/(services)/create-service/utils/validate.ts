export const VALIDATION = {
  title: { min: 10, max: 150 },
  description: { min: 50, max: 2000 },
  features: { min: 1, max: 10 },
  keywords: { min: 1, max: 5 },
  price: { min: 1 },
  deliveryDays: { min: 1, max: 90 },
  images: { max: 5 },
};

export type ValidationErrors = Record<string, string>;

interface ValidateServiceInput {
  category: string;
  title: string;
  description: string;
  features: string[];
  keywords: string[];
  price: number;
  deliveryDays: number;
  imagesCount: number;
}

export const validateService = ({
  category,
  title,
  description,
  features,
  keywords,
  price,
  deliveryDays,
  imagesCount,
}: ValidateServiceInput): ValidationErrors => {
  const errors: ValidationErrors = {};

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!category) {
    errors.category = "Please select a category";
  }

  if (trimmedTitle.length < VALIDATION.title.min) {
    errors.title = `Title must be at least ${VALIDATION.title.min} characters`;
  } else if (trimmedTitle.length > VALIDATION.title.max) {
    errors.title = `Title must be at most ${VALIDATION.title.max} characters`;
  }

  if (trimmedDescription.length < VALIDATION.description.min) {
    errors.description = `Description must be at least ${VALIDATION.description.min} characters`;
  } else if (trimmedDescription.length > VALIDATION.description.max) {
    errors.description = `Description must be at most ${VALIDATION.description.max} characters`;
  }

  if (features.length < VALIDATION.features.min) {
    errors.features = "Add at least one feature";
  } else if (features.length > VALIDATION.features.max) {
    errors.features = `You can add up to ${VALIDATION.features.max} features only`;
  } else if (new Set(features).size !== features.length) {
    errors.features = "Features must be unique";
  }

  if (keywords.length < VALIDATION.keywords.min) {
    errors.keywords = "Add at least one keyword";
  } else if (keywords.length > VALIDATION.keywords.max) {
    errors.keywords = `You can add up to ${VALIDATION.keywords.max} keywords only`;
  } else if (new Set(keywords).size !== keywords.length) {
    errors.keywords = "Keywords must be unique";
  }

  if (!price || Number(price) < VALIDATION.price.min) {
    errors.price = `Enter a price of at least ${VALIDATION.price.min}`;
  }

  if (
    !deliveryDays ||
    !Number.isInteger(Number(deliveryDays)) ||
    Number(deliveryDays) < VALIDATION.deliveryDays.min ||
    Number(deliveryDays) > VALIDATION.deliveryDays.max
  ) {
    errors.deliveryDays = `Enter a delivery time between ${VALIDATION.deliveryDays.min} and ${VALIDATION.deliveryDays.max} days`;
  }

  if (imagesCount > VALIDATION.images.max) {
    errors.images = `You can upload up to ${VALIDATION.images.max} images only`;
  }

  return errors;
};
