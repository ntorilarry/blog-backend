export interface SignUpRequest {
  body: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
  app: {
    db: any; // Replace `any` with the actual type of your database instance.
  };
}
