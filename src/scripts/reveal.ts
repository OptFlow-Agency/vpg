const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function countUp(el: HTMLElement) {
	const target = Number(el.dataset.value);
	const format = new Intl.NumberFormat('en-US');
	if (reduceMotion) {
		el.textContent = format.format(target);
		return;
	}
	const duration = 2000;
	const start = performance.now();
	const tick = (now: number) => {
		const t = Math.min((now - start) / duration, 1);
		el.textContent = format.format(Math.round(target * easeOutExpo(t)));
		if (t < 1) requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
}

const io = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			const el = entry.target as HTMLElement;
			el.classList.add('is-visible');
			el.querySelectorAll<HTMLElement>('[data-value]').forEach(countUp);
			io.unobserve(el);
		}
	},
	{ threshold: 0.3 },
);

document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
