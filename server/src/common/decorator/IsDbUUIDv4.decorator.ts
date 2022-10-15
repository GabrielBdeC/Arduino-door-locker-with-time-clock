import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDbUUIDv4(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDbUuidv4',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value.match(
            /^[0-9A-F]{8}[0-9A-F]{4}4[0-9A-F]{3}[89AB][0-9A-F]{3}[0-9A-F]{12}$/,
          );
        },
        defaultMessage() {
          return 'Invalid UUID';
        },
      },
    });
  };
}
