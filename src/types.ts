type Test = {
	id: number;
	name: string;
};

type Settings = {
	version: string;
	slot: {
		background: string;
		width: number;
		height: number;
		reels: number;
		rows: number;
		rowsVisible: number;
		fps: number;
		symbols: {
			[key: string]: {
				image: string;
				multiplier: number;
			};
		};
	};
	debug: boolean;
};

type Velocity = {
	x: number;
	y: number;
};

type WinningLines = {
	[key: number]: Array<Array<number>>;
};
