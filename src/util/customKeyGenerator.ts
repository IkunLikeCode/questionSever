const customKeyGenerator = (req: Request) => {
  return (req as any).ip;
};

export default customKeyGenerator;
