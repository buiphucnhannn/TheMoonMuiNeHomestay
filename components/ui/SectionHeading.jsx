import { cn } from '@/lib/utils';

/**
 * Tiêu đề section dùng chung: eyebrow + tiêu đề serif (có thể chèn dòng script) + mô tả.
 * <SectionHeading eyebrow="Bảng giá" title="Chọn thời gian" script="nghỉ ngơi của bạn" desc="..." />
 */
export default function SectionHeading({ eyebrow, title, script, desc, align = 'left', dark = false, className = '', reveal = 'drop', delay = 0 }) {
  const center = align === 'center';
  return (
    <div data-reveal={reveal} data-reveal-delay={delay || undefined} className={cn(center ? 'mx-auto text-center max-w-2xl' : 'text-left', className)}>
      {eyebrow ? <p className={cn('eyebrow mb-3', center && 'justify-center', dark && 'text-moon-soft')}>{eyebrow}</p> : null}
      <h2 className={cn('font-serif text-[34px] sm:text-[42px] leading-[1.1] tracking-tight text-balance', dark ? 'text-white' : 'text-ink')}>
        {title}
        {script ? (
          <>
            <br />
            <span className={cn('font-script font-medium text-[42px] sm:text-[54px] leading-[1.05]', dark ? 'text-moon-soft' : 'text-moon-deep')}>
              {script}
            </span>
          </>
        ) : null}
      </h2>
      {desc ? <p className={cn('mt-4 text-[15px] sm:text-[16px] leading-relaxed text-pretty', dark ? 'text-white/75' : 'text-muted', center ? 'mx-auto max-w-xl' : 'text-justify')}>{desc}</p> : null}
    </div>
  );
}
