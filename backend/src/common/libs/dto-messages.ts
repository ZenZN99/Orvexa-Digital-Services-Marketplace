export const dtoMessages = {
  auth: {
    firstName: {
      isString: 'The first name must be in text',
      isNotEmpty: 'First name is required',
      minLength: 'The first name is very short',
      maxLength: 'The first name is too long',
    },

    lastName: {
      isString: 'The last name must be in text',
      isNotEmpty: 'Last name is required',
      minLength: 'The last name is very short',
      maxLength: 'The last name is too long',
    },

    email: {
      isEmail: 'Invalid email address',
      isNotEmpty: 'Email is required',
    },

    password: {
      isString: 'The password must be in text',
      isNotEmpty: 'Password is required',
      minLength: 'The password is very short',
      maxLength: 'The password is too long',
    },

    role: {
      isNotEmpty: 'Role is required',
      isEnum: 'Invalid role value',
    },
  },

  userProfile: {
    bio: {
      isString: 'Bio must be a string',
      minLength: 'Bio must be at least 3 characters',
      maxLength: 'Bio must not exceed 254 characters',
    },
  },

  freelancer: {
    jobTitle: {
      isEnum: 'Invalid job title',
    },

    about: {
      isString: 'About must be a string',
      minLength: 'About must be at least 3 characters',
      maxLength: 'About must not exceed 1000 characters',
    },

    skills: {
      isArray: 'Skills must be an array',
      maxSize: 'You can select a maximum of 10 skills',
      unique: 'Skills must be unique',
      isEnum: 'Each skill must be a valid skill',
    },

    website: {
      isString: 'Website must be a string',
      maxLength: 'Website must not exceed 255 characters',
    },
  },

  service: {
    category: {
      isEnum: 'Category must be a valid service category.',
    },

    title: {
      isString: 'Title must be a string.',
      isNotEmpty: 'Title is required.',
      minLength: 'Title must be at least 10 characters long.',
      maxLength: 'Title must not exceed 150 characters.',
    },

    description: {
      isString: 'Description must be a string.',
      isNotEmpty: 'Description is required.',
      minLength: 'Description must be at least 50 characters long.',
      maxLength: 'Description must not exceed 5000 characters.',
    },

    features: {
      isArray: 'Features must be an array.',
      minSize: 'Service must have at least one feature.',
      maxSize: 'Service cannot have more than 10 features.',
      unique: 'Features must not contain duplicates.',
      isString: 'Each feature must be a string.',
    },

    keywords: {
      isArray: 'Keywords must be an array.',
      minSize: 'Service must have at least one keyword.',
      maxSize: 'Service cannot have more than 5 keywords.',
      unique: 'Keywords must not contain duplicates.',
      isString: 'Each keyword must be a string.',
    },

    price: {
      isNumber: 'Price must be a number.',
      min: 'Price must be at least 1.',
    },

    deliveryDays: {
      isInt: 'Delivery days must be an integer.',
      min: 'Delivery time must be at least 1 day.',
      max: 'Delivery time cannot exceed 90 days.',
    },
  },
  message: {
    content: {
      isString: 'Message content must be a string.',
      isNotEmpty: 'Message content cannot be empty.',
      maxLength: 'Message content must not exceed 5000 characters.',
    },
  },

  userVerification: {
    status: {
      isEnum: 'Status must be a valid verification status.',
    },

    rejectionReason: {
      isString: 'Rejection reason must be a string.',
      maxLength: 'Rejection reason must not exceed 500 characters.',
    },
  },
  review: {
    rating: {
      isInt: 'Rating must be an integer.',
      min: 'Rating must be at least 1.',
      max: 'Rating must not exceed 5.',
    },
    comment: {
      isString: 'Comment must be a string.',
      isNotEmpty: 'Comment cannot be empty.',
      minLength: 'Comment must be at least 10 characters.',
      maxLength: 'Comment must not exceed 200 characters.',
    },
  },
} as const;
