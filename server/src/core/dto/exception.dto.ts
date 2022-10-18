export type ErrorDtoType = {
  reason: string;
  message: string;
};

export class ExceptionDto {
  public status: number;
  public timestamp: string;
  public location: string;
  public method: string;
  public errors: ErrorDtoType[];
}
