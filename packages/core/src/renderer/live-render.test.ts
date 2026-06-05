import { describe, expect, it } from 'vitest';
import { Terminal } from '../terminal/Terminal.js';
import { LiveRender } from './live-render.js';
import { Screen } from '../terminal/Screen.js';

describe('LiveRender', () => {
    it('does not emit clearScreen sequences', () => {
        const fakeStdout: any = {
            writes: '',
            columns: 80,
            rows: 24,
            isTTY: true,
            write(s: string) {
                this.writes += s;
            },
            on() {},
            off() {},
        };

        const fakeStdin: any = {
            isTTY: true,
            setRawMode() {},
            resume() {},
            pause() {},
            on() {},
            off() {},
        };

        const terminal = new Terminal({
            stdout: fakeStdout,
            stdin: fakeStdin,
        });

        const screen = new Screen(80, 24);
        const live = new LiveRender(terminal, screen);

        live.render('hello');
        live.render('world');

        expect(fakeStdout.writes).not.toContain('\x1b[2J');

        terminal.restore();
    });
    it('emits clearLine sequences based on previous render height', () => {
    const fakeStdout: any = {
        writes: '',
        columns: 80,
        rows: 24,
        isTTY: true,
        write(s: string) {
            this.writes += s;
        },
        on() {},
        off() {},
    };

    const fakeStdin: any = {
        isTTY: true,
        setRawMode() {},
        resume() {},
        pause() {},
        on() {},
        off() {},
    };

    const terminal = new Terminal({
        stdout: fakeStdout,
        stdin: fakeStdin,
    });

    const screen = new Screen(80, 24);
    const live = new LiveRender(terminal, screen);

    live.render('A\nB\nC');
    fakeStdout.writes = '';

    live.render('X\nY\nZ');

    const clearLineCount =
        (fakeStdout.writes.match(/\x1b\[2K/g) ?? []).length;

    expect(clearLineCount).toBe(3);

    terminal.restore();
    });

    it('moves cursor up by previous render height', () => {
    const fakeStdout: any = {
        writes: '',
        columns: 80,
        rows: 24,
        isTTY: true,
        write(s: string) {
            this.writes += s;
        },
        on() {},
        off() {},
    };

    const fakeStdin: any = {
        isTTY: true,
        setRawMode() {},
        resume() {},
        pause() {},
        on() {},
        off() {},
    };

    const terminal = new Terminal({
        stdout: fakeStdout,
        stdin: fakeStdin,
    });

const screen = new Screen(80, 24);

const live = new LiveRender(
    terminal,
    screen
);

    live.render('A\nB\nC');
    fakeStdout.writes = '';

    live.render('X\nY\nZ');

    expect(fakeStdout.writes).toContain('\x1b[3A');

    terminal.restore();
    });
});