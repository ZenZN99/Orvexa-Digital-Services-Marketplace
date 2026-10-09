export declare const dtoMessages: {
    readonly auth: {
        readonly firstName: {
            readonly isString: "The first name must be in text";
            readonly isNotEmpty: "First name is required";
            readonly minLength: "The first name is very short";
            readonly maxLength: "The first name is too long";
        };
        readonly lastName: {
            readonly isString: "The last name must be in text";
            readonly isNotEmpty: "Last name is required";
            readonly minLength: "The last name is very short";
            readonly maxLength: "The last name is too long";
        };
        readonly email: {
            readonly isEmail: "Invalid email address";
            readonly isNotEmpty: "Email is required";
        };
        readonly password: {
            readonly isString: "The password must be in text";
            readonly isNotEmpty: "Password is required";
            readonly minLength: "The password is very short";
            readonly maxLength: "The password is too long";
        };
        readonly role: {
            readonly isNotEmpty: "Role is required";
            readonly isEnum: "Invalid role value";
        };
    };
    readonly userProfile: {
        readonly bio: {
            readonly isString: "Bio must be a string";
            readonly minLength: "Bio must be at least 3 characters";
            readonly maxLength: "Bio must not exceed 254 characters";
        };
    };
    readonly freelancer: {
        readonly jobTitle: {
            readonly isEnum: "Invalid job title";
        };
        readonly about: {
            readonly isString: "About must be a string";
            readonly minLength: "About must be at least 3 characters";
            readonly maxLength: "About must not exceed 1000 characters";
        };
        readonly skills: {
            readonly isArray: "Skills must be an array";
            readonly maxSize: "You can select a maximum of 10 skills";
            readonly unique: "Skills must be unique";
            readonly isEnum: "Each skill must be a valid skill";
        };
        readonly website: {
            readonly isString: "Website must be a string";
            readonly maxLength: "Website must not exceed 255 characters";
        };
    };
    readonly service: {
        readonly category: {
            readonly isEnum: "Category must be a valid service category.";
        };
        readonly title: {
            readonly isString: "Title must be a string.";
            readonly isNotEmpty: "Title is required.";
            readonly minLength: "Title must be at least 10 characters long.";
            readonly maxLength: "Title must not exceed 150 characters.";
        };
        readonly description: {
            readonly isString: "Description must be a string.";
            readonly isNotEmpty: "Description is required.";
            readonly minLength: "Description must be at least 50 characters long.";
            readonly maxLength: "Description must not exceed 5000 characters.";
        };
        readonly features: {
            readonly isArray: "Features must be an array.";
            readonly minSize: "Service must have at least one feature.";
            readonly maxSize: "Service cannot have more than 10 features.";
            readonly unique: "Features must not contain duplicates.";
            readonly isString: "Each feature must be a string.";
        };
        readonly keywords: {
            readonly isArray: "Keywords must be an array.";
            readonly minSize: "Service must have at least one keyword.";
            readonly maxSize: "Service cannot have more than 5 keywords.";
            readonly unique: "Keywords must not contain duplicates.";
            readonly isString: "Each keyword must be a string.";
        };
        readonly price: {
            readonly isNumber: "Price must be a number.";
            readonly min: "Price must be at least 1.";
        };
        readonly deliveryDays: {
            readonly isInt: "Delivery days must be an integer.";
            readonly min: "Delivery time must be at least 1 day.";
            readonly max: "Delivery time cannot exceed 90 days.";
        };
    };
    readonly message: {
        readonly content: {
            readonly isString: "Message content must be a string.";
            readonly isNotEmpty: "Message content cannot be empty.";
            readonly maxLength: "Message content must not exceed 5000 characters.";
        };
    };
    readonly userVerification: {
        readonly status: {
            readonly isEnum: "Status must be a valid verification status.";
        };
        readonly rejectionReason: {
            readonly isString: "Rejection reason must be a string.";
            readonly maxLength: "Rejection reason must not exceed 500 characters.";
        };
    };
    readonly review: {
        readonly rating: {
            readonly isInt: "Rating must be an integer.";
            readonly min: "Rating must be at least 1.";
            readonly max: "Rating must not exceed 5.";
        };
        readonly comment: {
            readonly isString: "Comment must be a string.";
            readonly isNotEmpty: "Comment cannot be empty.";
            readonly minLength: "Comment must be at least 10 characters.";
            readonly maxLength: "Comment must not exceed 200 characters.";
        };
    };
};
