type SegmentType = "STRAIGHT" | "LEFT_TURN" | "RIGHT_TURN" | "DROP" | "SPLASH";

interface TrackSegment {
    type: SegmentType;
    xOffset: number;
    width: number;
}

interface Player {
    x: number;
    targetX: number;
    speed: number;
    distance: number;
}

class GUISliderSimulator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private segments: TrackSegment[] = [];
    private isGameOver: boolean = false;
    
    private currentScrollY: number = 0;
    private segmentHeight: number = 40;
    private maxSegments: number = 20;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        
        this.player = {
            x: this.canvas.width / 2,
            targetX: this.canvas.width / 2,
            speed: 30,
            distance: 0
        };

        let lastX = this.canvas.width / 2;
        for (let i = 0; i < this.maxSegments; i++) {
            this.segments.push({ type: "STRAIGHT", xOffset: lastX, width: 100 });
        }
    }

    private generateNextSegment(): void {
        const lastSegment = this.segments[this.segments.length - 1];
        const types: SegmentType[] = ["STRAIGHT", "LEFT_TURN", "RIGHT_TURN", "DROP", "SPLASH"];
        const weights = [0.4, 0.2, 0.2, 0.1, 0.1];
        
        let type: SegmentType = "STRAIGHT";
        const rand = Math.random();
        let sum = 0;
        for (let i = 0; i < types.length; i++) {
            sum += weights[i];
            if (rand <= sum) {
                type = types[i];
                break;
            }
        }

        let nextX = lastSegment.xOffset;
        let nextWidth = 100;

        if (type === "LEFT_TURN") nextX = Math.max(80, nextX - 25);
        if (type === "RIGHT_TURN") nextX = Math.min(this.canvas.width - 80, nextX + 25);
        if (type === "DROP") nextWidth = 80;
        if (type === "SPLASH") nextWidth = 140;

        this.segments.push({ type, xOffset: nextX, width: nextWidth });
        if (this.segments.length > this.maxSegments) {
            this.segments.shift();
        }
    }

    private update(): void {
        if (this.isGameOver) return;

        const speedFactor = this.player.speed / 60;
        this.currentScrollY += 4 * speedFactor; 

        if (this.currentScrollY >= this.segmentHeight) {
            this.currentScrollY -= this.segmentHeight;
            this.player.distance += 1;
            this.generateNextSegment();

            const currentSeg = this.segments[5];
            this.handleSegmentEffect(currentSeg);
        }

        const targetSeg = this.segments[5];
        this.player.targetX = targetSeg.xOffset;
        this.player.x += (this.player.targetX - this.player.x) * 0.15;

        document.getElementById("dist-val")!.innerText = Math.floor(this.player.distance).toString();
        document.getElementById("speed-val")!.innerText = this.player.speed.toFixed(1);

        if (this.player.distance >= 150) {
            this.endGame();
        }
    }

    private handleSegmentEffect(seg: TrackSegment): void {
        const statusEl = document.getElementById("status-val")!;
        switch (seg.type) {
            case "STRAIGHT":
                this.player.speed = Math.max(25, this.player.speed + (Math.random() * 2 - 1));
                statusEl.innerText = "順調に加速中！";
                break;
            case "LEFT_TURN":
            case "RIGHT_TURN":
                this.player.speed = Math.max(20, this.player.speed - 1);
                statusEl.innerText = "急カーブ！耐えろ！";
                break;
            case "DROP":
                this.player.speed = Math.min(100, this.player.speed + 8);
                this.triggerToast("📉 急降下ァ！！");
                statusEl.innerText = "ウオオオ！落ちる！！";
                break;
            case "SPLASH":
                this.player.speed = Math.max(15, this.player.speed - 6);
                this.triggerToast("💦 ザブーーーン！");
                statusEl.innerText = "水飛沫で大減速！";
                break;
        }
    }

    private triggerToast(text: string): void {
        const toast = document.getElementById("effect-toast")!;
        toast.innerText = text;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 500);
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            const y = (i * this.segmentHeight) - this.currentScrollY;

            switch (seg.type) {
                case "DROP": this.ctx.fillStyle = "#e056fd"; break;
                case "SPLASH": this.ctx.fillStyle = "#30336b"; break;
                default: this.ctx.fillStyle = "#00a8ff";
            }

            this.ctx.fillRect(seg.xOffset - seg.width / 2, y, seg.width, this.segmentHeight);
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(seg.xOffset - seg.width / 2 - 4, y, 4, this.segmentHeight);
            this.ctx.fillRect(seg.xOffset + seg.width / 2, y, 4, this.segmentHeight);
        }

        const playerY = 5 * this.segmentHeight; 
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.save();
        this.ctx.translate(this.player.x, playerY);
        const tilt = (this.player.x - this.player.targetX) * -0.02;
        this.ctx.rotate(tilt);
        this.ctx.fillText("🏄", 0, 0);
        this.ctx.restore();
    }

    private endGame(): void {
        this.isGameOver = true;
        const statusVal = document.getElementById("status-val")!;
        statusVal.innerText = "🎉 ゴールイン！！";
        statusVal.style.color = "#4cd137";
        
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 36px Arial";
        this.ctx.fillText("🎉 GOAL!! 🙌", this.canvas.width / 2, this.canvas.height / 2 - 40);
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`記録: 150m 完走`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText(`最終速度: ${this.player.speed.toFixed(1)} km/h`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    public loop(): void {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// 起動
const sim = new GUISliderSimulator("stage");
sim.loop();