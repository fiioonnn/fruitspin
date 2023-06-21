const canvas = document.getElementById("slot") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let CANVAS_BACKGROUND: string = "#000";

function initCanvas(width: number, height: number, color?: string): void {
	// Set the canvas size to the sizes defined in settings.json
	canvas.width = width;
	canvas.height = height;

	// Set the canvas background to the background defined in settings.json
	CANVAS_BACKGROUND = color || "#000";

	// Set a black background
	ctx.fillStyle = color || "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas(): void {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = CANVAS_BACKGROUND;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export { canvas, ctx, initCanvas, clearCanvas };
