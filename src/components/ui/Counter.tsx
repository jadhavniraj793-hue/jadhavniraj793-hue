import { useCountUp } from '../../hooks/useCountUp';

type Props = { value: number; suffix?: string; prefix?: string; decimals?: number; duration?: number; className?: string };

export function Counter({ value, suffix = '', prefix = '', decimals = 0, duration = 1600, className }: Props) {
  const { ref, value: current } = useCountUp(value, duration, decimals);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {current.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
