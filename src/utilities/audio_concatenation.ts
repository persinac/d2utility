const { readFile } = require("./file_util");

/**
 * promise-wrapped utility functions
 */
export const readAudioBuffers = (files): Promise<Buffer[]> => {
    return Promise.all<Buffer>(files.map(path => {
        return readFile("recordings\\" + path);
    }));
};

export async function concatenate(files): Promise<Buffer> {
    const buffers = await readAudioBuffers(files);
    const totalBufferLength = buffers
        .map(buffer => buffer.length)
        .reduce((total, length) => total + length);
    return Buffer.concat(buffers, totalBufferLength);
}
