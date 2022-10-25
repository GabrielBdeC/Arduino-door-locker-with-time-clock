export type ErrorType = {
  reason: string;
  message: string;
};

export class Exception {
  public status: number;
  public timestamp: string;
  public location: string;
  public method: string;
  public errors: ErrorType[];
}