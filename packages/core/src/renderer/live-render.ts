import type { Terminal } from '../terminal/Terminal.js';
import { moveUp, clearLine } from '../utils/ansi.js';
import type { Screen } from '../terminal/Screen.js';
export class LiveRender {

    constructor(
        private readonly terminal: Terminal,
         private readonly screen: Screen
    ) {}

    private getHeight(frame: string): number {
        return frame.split('\n').length;
    }

    render(frame: string): void {
        let output = '';

        if (this.screen.lastRenderedHeight > 0) {
            output += moveUp(this.screen.lastRenderedHeight);

            for (let i = 0; i < this.screen.lastRenderedHeight; i++) {
                output += clearLine;

                if (i < this.screen.lastRenderedHeight - 1) {
                    output += '\n';
                }
            }

            output += moveUp(
                Math.max(0, this.screen.lastRenderedHeight - 1)
            );
        }

        output += frame;

        this.terminal.write(output);

        this.screen.lastRenderedHeight = this.getHeight(frame);
    }
}