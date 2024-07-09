export interface PrismaServiceInterface {
  onModuleInit(): Promise<void>;
  onModuleDestroy(): Promise<void>;
}

export interface PrismaModuleForRootOptions {
  service: new () => PrismaServiceInterface;
  global?: boolean;
}
