interface BrandProps {
  titleClassName?: string;
}

export function Brand({ titleClassName = 'text-2xl md:text-3xl' }: BrandProps) {
  return (
    <div className="flex items-center">
      <h1 className={`font-script text-primary font-bold ${titleClassName}`}>WedPlan</h1>
    </div>
  );
}
