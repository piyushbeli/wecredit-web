/**
 * Sheared diagonal grid with a clear band from top-right to bottom-left.
 */
const LoanBannerPerspectiveGrid = (): React.ReactNode => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={[
          'absolute -inset-[55%]',
          '[background-image:linear-gradient(to_right,rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.32)_1px,transparent_1px)]',
          '[background-size:42px_42px]',
          '[transform:skewY(-36deg)_skewX(-10deg)]',
          '[mask-image:linear-gradient(135deg,black_0%,black_28%,transparent_38%,transparent_62%,black_72%,black_100%)]',
        ].join(' ')}
      />
    </div>
  );
};

export default LoanBannerPerspectiveGrid;
