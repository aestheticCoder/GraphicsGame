import {ObjMesh} from './objmesh.js';

/**
 * Returns an ObjMesh object that is centered at the origin with given side length.
 * Basically the same as makeCube but just with the top side so that I can make a flat square plane
 * @param {Number} sideLength the length of a side of the cube
 * @returns {ObjMesh} the mesh
 */
export function makeFlatPlane( sideLength = 1.0 ) {
    const sl2 = sideLength / 2.0;

    const objData = {
        points: [
            [sl2, sl2, sl2], [-sl2, sl2, sl2], [sl2, sl2, -sl2], [-sl2, sl2, -sl2],
        ],
        normals: [
            [0, 1, 0]
        ],
        uvs: [
            [0, 0], [1, 0], [1, 1], [0, 1],
        ],

        verts: [
            // Top face
            {p: 1, n: 0, uv: 0}, {p: 0, n: 0, uv: 1}, {p: 2, n: 0, uv: 2},
            {p: 1, n: 0, uv: 0}, {p: 2, n: 0, uv: 2}, {p: 3, n: 0, uv: 3},
        ],
    };

    return new ObjMesh(objData);
}