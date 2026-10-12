import Lenis from 'lenis';

declare global {
	interface Window {
		lenis?: Lenis;
	}
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
	const lenis = new Lenis({ lerp: 0.1, anchors: true });
	window.lenis = lenis;

	const raf = (time: number) => {
		lenis.raf(time);
		requestAnimationFrame(raf);
	};
	requestAnimationFrame(raf);
}
