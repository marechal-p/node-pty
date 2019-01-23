/**
 * Copyright (c) 2017, Daniel Imms (MIT License).
 */

import * as Interfaces from '../src/interfaces';

declare module '@theia/node-pty' {
  /**
   * Forks a process as a pseudoterminal.
   * @param file The file to launch.
   * @param args The file's arguments as argv (string[]) or in a pre-escaped CommandLine format
   * (string). Note that the CommandLine option is only available on Windows and is expected to be
   * escaped properly.
   * @param options The options of the terminal.
   * @see CommandLineToArgvW https://msdn.microsoft.com/en-us/library/windows/desktop/bb776391(v=vs.85).aspx
   * @see Parsing C++ Comamnd-Line Arguments https://msdn.microsoft.com/en-us/library/17w5ykft.aspx
   * @see GetCommandLine https://msdn.microsoft.com/en-us/library/windows/desktop/ms683156.aspx
   */
  export function spawn(file: string, args: string[] | string, options: IPtyForkOptions): IPty;

  /**
   * UNIX ONLY
   * Opens an empty pty (master+slave).
   * @param options
   */
  export function open(options?: IPtyOpenOptions): IPty;

  export type IPtyForkOptions = Interfaces.IPtyForkOptions;
  export type IPtyOpenOptions = Interfaces.IPtyOpenOptions;

  /**
   * An interface representing a pseudoterminal, on Windows this is emulated via the winpty library.
   */
  export interface IPty {
    /**
     * The process ID of the outer process.
     */
    pid: number;

    /**
     * The title of the active process.
     */
    process: string;

    /**
     * Name/ID of the pty.
     * Windows: Value is an arbitrary number.
     * UNIX: Value is the file representing the pty.
     */
    pty: string;

    /**
     * Adds a listener to the data event, fired when data is returned from the pty.
     * @param event The name of the event.
     * @param listener The callback function.
     */
    on(event: 'data', listener: (data: string) => void): void;

    /**
     * Adds a listener to the exit event, fired when the pty exits.
     * @param event The name of the event.
     * @param listener The callback function, exitCode is the exit code of the process and signal is
     * the signal that triggered the exit. signal is not supported on Windows.
     */
    on(event: 'exit', listener: (exitCode: number, signal?: number) => void): void;

    /**
     * Adds a listener to the exec event, fired when the child process execs (or fails to do so).
     * @param event The name of the event.
     * @param listener The callback function called when the child process has succeeded or failed to exec.
     * The `error` parameter is undefined if the exec succeeded, otherwise it is the an errno string (e.g. ENOENT).
     */
    on(event: 'exec', listener: (error?: string) => void): void;

    /**
     * Resizes the dimensions of the pty.
     * @param columns THe number of columns to use.
     * @param rows The number of rows to use.
     */
    resize(columns: number, rows: number): void;

    /**
     * Writes data to the pty.
     * @param data The data to write.
     */
    write(data: string): void;

    /**
     * Kills the pty.
     * @param signal The signal to use, defaults to SIGHUP. This parameter is not supported on
     * Windows.
     * @throws Will throw when signal is used on Windows.
     */
    kill(signal?: string): void;
  }
}
