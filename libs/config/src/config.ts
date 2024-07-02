export type ENVConfiguration = ReturnType<typeof config>;

export const config = () => ({
  port: Number(process.env.PORT) || 3000,
});
