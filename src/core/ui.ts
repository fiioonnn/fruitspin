function onButtonPressed(selector: string, callback: Function): void {
	const button = document.querySelector(`#${selector}`) as HTMLButtonElement;

	if (!button) throw new Error(`Selector "${selector}" not found`);

	button.onclick = () => callback(button);
}

function toggleClass(selector: string, className: string) {
	const button = document.querySelector(`#${selector}`) as HTMLButtonElement;

	if (!button) throw new Error(`Selector "${selector}" not found`);

	button.classList.toggle(className);
}

// ? OK
function changeStat(frameSelector: string, value: number): void {
	const frame = document.querySelector(
		`#${frameSelector}Frame`
	) as HTMLDivElement;

	const fixedValue: string = (value / 100).toFixed(2);
	const euro: string = fixedValue.split(".")[0];
	const cents: string = fixedValue.split(".")[1];

	const euroElement = frame.querySelector("p") as HTMLParagraphElement;
	const centsElement = frame.querySelector("span") as HTMLSpanElement;

	if (euro === "0" && cents !== "00") {
		euroElement.textContent = null;
		centsElement.textContent = cents;
	} else {
		euroElement.textContent = euro;
		centsElement.textContent = cents;
	}
}

export { onButtonPressed, changeStat, toggleClass };
